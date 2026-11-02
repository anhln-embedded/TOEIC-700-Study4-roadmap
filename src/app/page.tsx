'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { Header } from '@/components/Header';
import { AuthScreen } from '@/components/AuthScreen';
import { DashboardStats } from '@/components/DashboardStats';
import { StrategyBanner } from '@/components/StrategyBanner';
import { ScoreProgressChart } from '@/components/ScoreProgressChart';
import { FilterControls } from '@/components/FilterControls';
import { DayCard } from '@/components/DayCard';
import { ExamTimerModal } from '@/components/ExamTimerModal';
import { QuickToast } from '@/components/QuickToast';
import { SCHEDULE_DATA, UserProgressMap } from '@/data/scheduleData';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

export default function Home() {
  const [progress, setProgress] = useState<UserProgressMap>({});
  const [activeWeek, setActiveWeek] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured);
  const [dataReady, setDataReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Restore the Supabase session. Authentication state is shared safely across tabs,
  // while learning data itself always comes from the database.
  useEffect(() => {
    const client = supabase;
    if (!client) return;

    let active = true;
    client.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setAuthReady(true);
    });

    const { data: authListener } = client.auth.onAuthStateChange((_event, session) => {
      if (!active) return;
      setUser(session?.user ?? null);
      setDataReady(false);
      if (!session) {
        setProgress({});
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
      setAuthReady(true);
    });

    return () => {
      active = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Load the signed-in user's private row and listen for changes from other devices.
  useEffect(() => {
    const client = supabase;
    if (!client || !user) return;

    let active = true;

    const loadProfile = async () => {
      setSyncStatus('saving');
      const { data, error } = await client
        .from('study_profiles')
        .select('progress, theme')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!active) return;
      if (error) {
        console.error('Failed to load cloud progress', error);
        setSyncStatus('error');
        setDataReady(true);
        return;
      }

      const cloudProgress = (data?.progress ?? {}) as UserProgressMap;
      const cloudTheme = data?.theme === 'dark';
      setProgress(cloudProgress);
      setIsDarkMode(cloudTheme);
      document.documentElement.classList.toggle('dark', cloudTheme);

      if (!data) {
        const { error: createError } = await client.from('study_profiles').insert({
          user_id: user.id,
          progress: {},
          theme: 'light',
        });
        if (createError) {
          console.error('Failed to create cloud profile', createError);
          setSyncStatus('error');
          setDataReady(true);
          return;
        }
      }

      setSyncStatus('saved');
      setDataReady(true);
    };

    void loadProfile();

    const channel = client
      .channel(`study-profile-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'study_profiles', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (!active) return;
          const row = payload.new as { progress?: UserProgressMap; theme?: 'light' | 'dark' };
          if (row.progress) setProgress(row.progress);
          if (row.theme) {
            const nextDarkMode = row.theme === 'dark';
            setIsDarkMode(nextDarkMode);
            document.documentElement.classList.toggle('dark', nextDarkMode);
          }
          setSyncStatus('saved');
        },
      )
      .subscribe();

    return () => {
      active = false;
      void client.removeChannel(channel);
    };
  }, [user]);

  useEffect(() => () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  }, []);

  const queueCloudSave = (nextProgress: UserProgressMap, nextDarkMode: boolean) => {
    const client = supabase;
    if (!client || !user) return;

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSyncStatus('saving');
    saveTimerRef.current = setTimeout(async () => {
      const { error } = await client.from('study_profiles').upsert({
        user_id: user.id,
        progress: nextProgress,
        theme: nextDarkMode ? 'dark' : 'light',
        updated_at: new Date().toISOString(),
      });
      if (error) {
        console.error('Failed to sync cloud progress', error);
        setSyncStatus('error');
      } else {
        setSyncStatus('saved');
      }
    }, 500);
  };

  const saveProgress = (newProgress: UserProgressMap) => {
    setProgress(newProgress);
    queueCloudSave(newProgress, isDarkMode);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    queueCloudSave(progress, next);
  };

  const handleSignOut = async () => {
    const client = supabase;
    if (!client || !user) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSyncStatus('saving');
    await client.from('study_profiles').upsert({
      user_id: user.id,
      progress,
      theme: isDarkMode ? 'dark' : 'light',
      updated_at: new Date().toISOString(),
    });
    await client.auth.signOut();
  };

  // Score Updater
  const handleUpdateScore = (index: number, lcStr: string, rcStr: string) => {
    const current = progress[index] || { status: 'pending' };
    const lcNum = parseInt(lcStr, 10);
    const rcNum = parseInt(rcStr, 10);
    const total = (!isNaN(lcNum) || !isNaN(rcNum)) ? (isNaN(lcNum) ? 0 : lcNum) + (isNaN(rcNum) ? 0 : rcNum) : '';

    const updated: UserProgressMap = {
      ...progress,
      [index]: {
        ...current,
        lcScore: lcStr,
        rcScore: rcStr,
        totalScore: total,
      }
    };
    saveProgress(updated);
  };

  // Notes Updater
  const handleUpdateNotes = (index: number, notes: string) => {
    const current = progress[index] || { status: 'pending' };
    const updated: UserProgressMap = {
      ...progress,
      [index]: {
        ...current,
        notes
      }
    };
    saveProgress(updated);
  };

  // Status Updater
  const handleUpdateStatus = (index: number, status: 'pending' | 'inprogress' | 'completed') => {
    const current = progress[index] || {};
    const updated: UserProgressMap = {
      ...progress,
      [index]: {
        ...current,
        status,
        completedAt: status === 'completed' ? new Date().toISOString() : undefined
      }
    };
    saveProgress(updated);
    showToast(`Đã chuyển trạng thái: ${status === 'completed' ? 'Đã hoàn thành 🎉' : status === 'inprogress' ? 'Đang làm ✍️' : 'Chưa làm'}`);
  };

  // Export Progress JSON
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(progress, null, 2));
    const a = document.createElement('a');
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `TOEIC_700_Study4_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Đã tải xuống file sao lưu tiến độ!');
  };

  // Import Progress JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (typeof imported === 'object' && imported !== null) {
          saveProgress(imported);
          showToast('Phục hồi dữ liệu thành công!');
        }
      } catch {
        alert('File sao lưu không hợp lệ!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtering
  const filteredSchedule = SCHEDULE_DATA.filter((item, index) => {
    // Week filter
    if (activeWeek !== 'all' && item.week !== activeWeek) return false;

    // Status filter
    const p = progress[index] || { status: 'pending' };
    if (statusFilter !== 'all' && (p.status || 'pending') !== statusFilter) return false;

    // Mode filter
    if (modeFilter !== 'all') {
      if (!item.mode.toLowerCase().includes(modeFilter.toLowerCase())) return false;
    }

    // Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = item.test_name.toLowerCase().includes(q);
      const matchTasks = item.tasks.toLowerCase().includes(q);
      const matchDay = item.day_num.toLowerCase().includes(q);
      const matchSource = item.source.toLowerCase().includes(q);
      if (!matchName && !matchTasks && !matchDay && !matchSource) return false;
    }

    return true;
  });

  if (!authReady) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-white/20 border-t-white" />
          <p className="mt-4 text-sm font-semibold text-slate-300">Đang kiểm tra phiên đăng nhập…</p>
        </div>
      </main>
    );
  }

  if (!user) return <AuthScreen />;

  if (!dataReady) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-white/20 border-t-blue-400" />
          <p className="mt-4 text-sm font-semibold text-slate-300">Đang tải tiến độ từ cloud…</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-stone-800 flex flex-col antialiased">
      
      {/* Top Navbar */}
      <Header
        onOpenTimer={() => setIsTimerOpen(true)}
        onExport={handleExport}
        onImport={handleImport}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        userEmail={user.email ?? 'Tài khoản học tập'}
        syncStatus={syncStatus}
        onSignOut={() => { void handleSignOut(); }}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        <div className="mb-5 sm:mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Bảng điều khiển học tập</p>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-stone-900">Tổng quan lộ trình 8 tuần</h2>
          <p className="mt-1 text-sm text-stone-500">Theo dõi tiến độ, điểm số và chọn bài cần tập trung hôm nay.</p>
        </div>
        
        {/* Metric Cards */}
        <DashboardStats progress={progress} totalDays={56} />

        {/* Tactical Strategy Reminder */}
        <StrategyBanner />

        {/* Score Progression Chart */}
        <ScoreProgressChart progress={progress} />

        {/* Filter Controls & Search */}
        <FilterControls
          activeWeek={activeWeek}
          onSelectWeek={setActiveWeek}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          modeFilter={modeFilter}
          onModeChange={setModeFilter}
          progress={progress}
        />

        {/* Schedule Grid */}
        {filteredSchedule.length === 0 ? (
          <div className="bg-white border border-amber-200 rounded-2xl p-10 sm:p-12 text-center text-stone-500 shadow-sm">
            <div className="text-3xl mb-3" aria-hidden="true">🔍</div>
            <h3 className="text-lg font-bold text-stone-900">Không tìm thấy bài học phù hợp</h3>
            <p className="text-xs text-stone-500 mt-1">Hãy thử xóa từ khóa tìm kiếm hoặc chọn lại tuần học khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredSchedule.map((item) => {
              const originalIndex = SCHEDULE_DATA.indexOf(item);
              return (
                <DayCard
                  key={originalIndex}
                  item={item}
                  index={originalIndex}
                  progress={progress[originalIndex]}
                  onUpdateScore={handleUpdateScore}
                  onUpdateNotes={handleUpdateNotes}
                  onUpdateStatus={handleUpdateStatus}
                />
              );
            })}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-amber-200/80 bg-white py-6 px-4 text-center text-xs text-stone-500">
        <p className="font-semibold text-amber-900">TOEIC 700+ Study4 Roadmap | Lộ trình luyện thi 8 tuần</p>
        <p className="mt-1">Tiến độ được đồng bộ riêng theo tài khoản qua Supabase · Không lưu dữ liệu học tập trong localStorage</p>
      </footer>

      {/* Exam Timer Modal */}
      <ExamTimerModal isOpen={isTimerOpen} onClose={() => setIsTimerOpen(false)} />

      {/* Toast */}
      <QuickToast message={toastMessage} />

    </div>
  );
}
