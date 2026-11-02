'use client';

import React from 'react';
import { BookOpen, Cloud, CloudOff, Download, LoaderCircle, LogOut, Moon, Sun, Target, Timer, Upload, UserRound } from 'lucide-react';

interface HeaderProps {
  onOpenTimer: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  userEmail: string;
  syncStatus: 'saved' | 'saving' | 'error';
  onSignOut: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenTimer,
  onExport,
  onImport,
  isDarkMode,
  onToggleTheme,
  userEmail,
  syncStatus,
  onSignOut,
}) => {
  return (
    <header className="border-b border-slate-700/60 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 shadow-lg shadow-slate-900/10 sticky top-0 z-40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 lg:gap-6">
          
          {/* Logo & Main Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-white/12 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shrink-0">
              <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
                  TOEIC 700+ Study4 Roadmap
                </h1>
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-blue-50 border border-white/15 whitespace-nowrap">
                  8 tuần · 56 ngày
                </span>
              </div>
              <p className="text-xs text-blue-100/85 font-medium mt-0.5 truncate">
                Collection 3–4 mới nhất · 20 Full Test · Mục tiêu 700+
              </p>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-2.5 py-2 text-xs text-white" title={userEmail}>
              <UserRound className="h-4 w-4 shrink-0" />
              <span className="hidden max-w-36 truncate xl:inline">{userEmail}</span>
              <span className="inline-flex items-center gap-1 text-blue-100">
                {syncStatus === 'saving' ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : syncStatus === 'error' ? <CloudOff className="h-3.5 w-3.5 text-rose-300" /> : <Cloud className="h-3.5 w-3.5 text-emerald-300" />}
                <span className="hidden 2xl:inline">{syncStatus === 'saving' ? 'Đang lưu' : syncStatus === 'error' ? 'Lỗi đồng bộ' : 'Đã đồng bộ'}</span>
              </span>
            </div>
            
            {/* Timer Modal Button */}
            <button
              onClick={onOpenTimer}
              className="primary-header-action inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold bg-white text-amber-900 hover:bg-amber-50 shadow-sm border border-white/80 transition-colors active:scale-[0.98] cursor-pointer"
            >
              <Timer className="w-4 h-4 text-amber-600" />
              <span>Đồng hồ 120p</span>
            </button>

            {/* Export Backup */}
            <button
              onClick={onExport}
              title="Sao lưu tiến độ học tập ra file JSON"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-sm transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Sao lưu</span>
            </button>

            {/* Import Backup */}
            <label
              title="Phục hồi dữ liệu từ file sao lưu JSON"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-sm transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-white" />
              <span className="hidden sm:inline">Phục hồi</span>
              <input type="file" accept=".json" onChange={onImport} className="hidden" />
            </label>

            {/* Open Study4 Quick Link */}
            <a
              href="https://study4.com/tests/toeic/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold bg-slate-950/35 hover:bg-slate-950/50 text-white border border-white/10 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-amber-300" />
              <span className="hidden sm:inline">Kho Đề Study4</span>
            </a>

            {/* Theme Toggle */}
            <button
              onClick={onToggleTheme}
              title="Chuyển chế độ Sáng / Tối"
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/15 backdrop-blur-sm transition-colors cursor-pointer"
              aria-label={isDarkMode ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-200" /> : <Moon className="w-4 h-4 text-amber-100" />}
            </button>

            <button
              onClick={onSignOut}
              title="Đăng xuất"
              aria-label="Đăng xuất"
              className="p-2 rounded-lg bg-white/10 hover:bg-rose-500/30 text-white border border-white/15 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
