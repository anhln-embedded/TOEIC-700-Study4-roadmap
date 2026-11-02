'use client';

import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { UserProgressMap, SCHEDULE_DATA } from '../data/scheduleData';

interface FilterControlsProps {
  activeWeek: string;
  onSelectWeek: (week: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  modeFilter: string;
  onModeChange: (mode: string) => void;
  progress: UserProgressMap;
}

const WEEKS = [
  { id: 'all', label: 'Tất cả (56 Ngày)' },
  { id: 'Tuần 1', label: 'Tuần 1: Baseline · C3 Test 1–2' },
  { id: 'Tuần 2', label: 'Tuần 2: Xây nền · C3 Test 3–4' },
  { id: 'Tuần 3', label: 'Tuần 3: Tăng tốc · C3 Test 5–7' },
  { id: 'Tuần 4', label: 'Tuần 4: Ổn định · C3 Test 8–10' },
  { id: 'Tuần 5', label: 'Tuần 5: Nâng khó · C4 Test 1–2' },
  { id: 'Tuần 6', label: 'Tuần 6: Bẫy khó · C4 Test 3–4' },
  { id: 'Tuần 7', label: 'Tuần 7: Nước rút · C4 Test 5–7' },
  { id: 'Tuần 8', label: 'Tuần 8: Mô phỏng · C4 Test 8–10' },
];

export const FilterControls: React.FC<FilterControlsProps> = ({
  activeWeek,
  onSelectWeek,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  modeFilter,
  onModeChange,
  progress
}) => {
  const getWeekDoneCount = (weekId: string) => {
    if (weekId === 'all') {
      return Object.values(progress).filter(p => p.status === 'completed').length;
    }
    let count = 0;
    SCHEDULE_DATA.forEach((item, index) => {
      if (item.week === weekId && progress[index]?.status === 'completed') {
        count++;
      }
    });
    return count;
  };

  const hasSecondaryFilters = searchQuery.trim() !== '' || statusFilter !== 'all' || modeFilter !== 'all';

  const clearSecondaryFilters = () => {
    onSearchChange('');
    onStatusChange('all');
    onModeChange('all');
  };

  return (
    <section className="bg-white border border-amber-200/80 rounded-2xl p-4 sm:p-5 mb-6 shadow-sm" aria-labelledby="schedule-filters-title">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h2 id="schedule-filters-title" className="text-sm font-bold text-stone-900">Lịch học & bộ lọc</h2>
            <p className="text-[11px] text-stone-500">Chọn tuần hoặc tìm nhanh một bài học</p>
          </div>
        </div>
        {hasSecondaryFilters && (
          <button
            type="button"
            onClick={clearSecondaryFilters}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Xóa lọc
          </button>
        )}
      </div>
      
      {/* Week Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 border-b border-amber-100 scrollbar-thin" role="tablist" aria-label="Chọn tuần học">
        {WEEKS.map((w) => {
          const isActive = activeWeek === w.id;
          const done = getWeekDoneCount(w.id);
          const max = w.id === 'all' ? 56 : 7;
          return (
            <button
              key={w.id}
              onClick={() => onSelectWeek(w.id)}
              role="tab"
              aria-selected={isActive}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50/70 text-stone-700 hover:bg-amber-100 hover:text-amber-900 border border-amber-200/70'
              }`}
            >
              <span>{w.label}</span>
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-white/25 text-white'
                    : done > 0
                    ? 'bg-amber-200 text-amber-900'
                    : 'bg-amber-100 text-amber-700'
                }`}
              >
                {done}/{max}
              </span>
            </button>
          );
        })}
      </div>

      {/* Controls Row: Search & Dropdowns */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Search */}
        <div className="relative w-full md:max-w-sm md:flex-1">
          <Search className="w-4 h-4 text-amber-700 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <label htmlFor="schedule-search" className="sr-only">Tìm bài học</label>
          <input
            id="schedule-search"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Tìm theo tên đề, Part, từ khóa..."
            className="w-full pl-9 pr-4 py-2.5 text-xs sm:text-sm rounded-lg bg-amber-50/40 border border-amber-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:bg-white transition-all font-medium"
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            aria-label="Lọc theo trạng thái"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg bg-amber-50/40 border border-amber-200 text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-semibold cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">⏳ Chưa làm</option>
            <option value="inprogress">✍️ Đang làm</option>
            <option value="completed">✅ Đã hoàn thành</option>
          </select>

          {/* Mode Filter */}
          <select
            aria-label="Lọc theo chế độ học"
            value={modeFilter}
            onChange={(e) => onModeChange(e.target.value)}
            className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-lg bg-amber-50/40 border border-amber-200 text-stone-800 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 font-semibold cursor-pointer"
          >
            <option value="all">Tất cả chế độ</option>
            <option value="Exam">Exam Mode (Thi thử 120p)</option>
            <option value="Practice">Practice Mode (Từng Part)</option>
            <option value="Review">Review & Chữa sâu</option>
            <option value="Flashcard">Flashcard & Từ vựng</option>
          </select>
        </div>

      </div>

    </section>
  );
};
