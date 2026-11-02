'use client';

import React, { useEffect, useRef, useState } from 'react';
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

interface UserState {
  id: string;
  username: string;
}

export default function Home() {
  const [currentUser, setCurrentUser] = useState<UserState | null>(null);
  const [progress, setProgress] = useState<UserProgressMap>({});
  const [activeWeek, setActiveWeek] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modeFilter, setModeFilter] = useState('all');
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Check existing session on mount
  useEffect(() => {
    let active = true;
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('toeic_session_user');
        if (storedUser) {
          const userObj = JSON.parse(storedUser) as UserState;
          if (userObj?.username) {
            const res = await fetch(`/toeic/api/progress?username=${encodeURIComponent(userObj.username)}`);
            if (res.ok) {
              const resData = await res.json();
              if (active && resData.success && resData.data) {
                setCurrentUser(userObj);
                setProgress(resData.data.progress || {});
                const isDark = resData.data.theme === 'dark';
                setIsDarkMode(isDark);
                document.documentElement.classList.toggle('dark', isDark);
                setAuthReady(true);
                return;
              }
            }
          }
        }
      } catch (e) {
        console.warn('Session restore failed', e);
      }
      if (active) setAuthReady(true);
    };

    void checkSession();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => () => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
  }, []);

  const queueSave = (nextProgress: UserProgressMap, nextDarkMode: boolean) => {
    if (!currentUser) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    setSyncStatus('saving');
    saveTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch('/toeic/api/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: currentUser.username,
            progress: nextProgress,
            theme: nextDarkMode ? 'dark' : 'light',
          }),
        });

        if (res.ok) {
          setSyncStatus('saved');
        } else {
          setSyncStatus('error');
        }
      } catch (err) {
        console.error('Failed to sync progress to server', err);
        setSyncStatus('error');
      }
    }, 300);
  };

  const saveProgress = (newProgress: UserProgressMap) => {
    setProgress(newProgress);
    queueSave(newProgress, isDarkMode);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleToggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    queueSave(progress, next);
  };

  const handleSignOut = () => {
    localStorage.removeItem('toeic_session_user');
    setCurrentUser(null);
    setProgress({});
    setIsDarkMode(false);
    document.documentElement.classList.remove('dark');
    showToast('Đã đăng xuất khỏi tài khoản.');
  };

  const handleAuthSuccess = async (user: UserState) => {
    setCurrentUser(user);
    localStorage.setItem('toeic_session_user', JSON.stringify(user));
    setSyncStatus('saving');
    try {
      const res = await fetch(`/toeic/api/progress?username=${encodeURIComponent(user.username)}`);
      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.data) {
          setProgress(resData.data.progress || {});
          const isDark = resData.data.theme === 'dark';
          setIsDarkMode(isDark);
          document.documentElement.classList.toggle('dark', isDark);
        }
      }
      setSyncStatus('saved');
    } catch {
      setSyncStatus('error');
    }
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

  // Filtering
  const filteredSchedule = SCHEDULE_DATA.filter((item, index) => {
    if (activeWeek !== 'all' && item.week !== activeWeek) return false;

    const p = progress[index] || { status: 'pending' };
    if (statusFilter !== 'all' && (p.status || 'pending') !== statusFilter) return false;

    if (modeFilter !== 'all') {
      if (!item.mode.toLowerCase().includes(modeFilter.toLowerCase())) return false;
    }

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
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-white/20 border-t-amber-400" />
          <p className="mt-4 text-sm font-semibold text-slate-300">Đang khởi động ứng dụng…</p>
        </div>
      </main>
    );
  }

  if (!currentUser) {
    return <AuthScreen onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-stone-800 flex flex-col antialiased">
      
      {/* Top Navbar */}
      <Header
        onOpenTimer={() => setIsTimerOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        username={currentUser.username}
        syncStatus={syncStatus}
        onSignOut={handleSignOut}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 w-full">
        <div className="mb-5 sm:mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">Bảng điều khiển học tập</p>
          <h2 className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-stone-900">Tổng quan lộ trình 8 tuần</h2>
          <p className="mt-1 text-sm text-stone-500">Tiến độ lưu riêng cho tài khoản <strong className="text-stone-700 font-semibold">{currentUser.username}</strong> trên máy chủ.</p>
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
        <p className="mt-1">Dữ liệu lộ trình học tập được lưu trữ và phân tách riêng theo từng tài khoản trên Server.</p>
      </footer>

      {/* Exam Timer Modal */}
      <ExamTimerModal isOpen={isTimerOpen} onClose={() => setIsTimerOpen(false)} />

      {/* Toast */}
      <QuickToast message={toastMessage} />

    </div>
  );
}
