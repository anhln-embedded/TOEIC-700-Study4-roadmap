'use client';

import React from 'react';
import { CheckCircle2, Trophy, BarChart3, Target, Sparkles } from 'lucide-react';
import { UserProgressMap } from '../data/scheduleData';

interface DashboardStatsProps {
  progress: UserProgressMap;
  totalDays?: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  progress,
  totalDays = 56
}) => {
  let completedCount = 0;
  let highestScore = 0;
  let highestBreakdown = "Chưa có bài test";
  let totalScores = 0;
  let scoredTestsCount = 0;

  Object.values(progress).forEach((item) => {
    if (item.status === 'completed') {
      completedCount++;
    }
    const total = typeof item.totalScore === 'number' ? item.totalScore : parseInt(String(item.totalScore), 10);
    if (!isNaN(total) && total > 0) {
      scoredTestsCount++;
      totalScores += total;
      if (total > highestScore) {
        highestScore = total;
        highestBreakdown = `LC: ${item.lcScore || '--'} | RC: ${item.rcScore || '--'}`;
      }
    }
  });

  const percentage = Math.round((completedCount / totalDays) * 100);
  const averageScore = scoredTestsCount > 0 ? Math.round(totalScores / scoredTestsCount) : null;
  const remainingDays = totalDays - completedCount;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6" aria-label="Thống kê tiến độ">
      
      {/* 1. Progress Card */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md relative overflow-hidden group hover:border-amber-400 transition-all">
        <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-800">Tiến độ toàn khóa</span>
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-stone-900">{completedCount}</span>
          <span className="text-stone-500 font-semibold text-lg">/ {totalDays}</span>
          <span className="text-xs font-black text-amber-800 px-2.5 py-0.5 rounded-full bg-amber-100 ml-auto border border-amber-300">
            {percentage}%
          </span>
        </div>
        <div className="w-full h-2.5 bg-amber-100 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="mt-2.5 text-xs text-stone-600 flex justify-between font-medium">
          <span>Còn lại <strong className="text-amber-800">{remainingDays}</strong> ngày</span>
          <span>Mục tiêu 8 tuần</span>
        </div>
      </div>

      {/* 2. Highest Score Card */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md relative overflow-hidden group hover:border-amber-400 transition-all">
        <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Điểm cao nhất</span>
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className={`text-3xl font-extrabold ${highestScore >= 700 ? 'text-emerald-600' : 'text-stone-900'}`}>
            {highestScore > 0 ? highestScore : '--'}
          </span>
          <span className="text-stone-500 text-sm font-semibold">/ 990</span>
          {highestScore >= 700 && (
            <span className="text-xs font-black text-emerald-800 px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 ml-auto flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Đạt 700+ 🎉
            </span>
          )}
        </div>
        <div className="mt-3 text-xs text-stone-600 flex items-center justify-between border-t border-amber-100 pt-2 font-medium">
          <span>Phân tích:</span>
          <span className="font-bold text-amber-900">{highestBreakdown}</span>
        </div>
      </div>

      {/* 3. Average Score Card */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md relative overflow-hidden group hover:border-amber-400 transition-all">
        <div className="absolute top-0 left-0 right-0 h-1 bg-violet-500" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Điểm trung bình</span>
          <div className="w-8 h-8 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-stone-900">
            {averageScore !== null ? averageScore : '--'}
          </span>
          <span className="text-stone-500 text-sm font-semibold">/ 990</span>
        </div>
        <div className="mt-3 text-xs text-stone-600 flex items-center justify-between border-t border-amber-100 pt-2 font-medium">
          <span>Full Tests:</span>
          <span className="font-bold text-amber-900">{scoredTestsCount} bài đã ghi điểm</span>
        </div>
      </div>

      {/* 4. Target Milestone */}
      <div className="bg-white border border-amber-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md relative overflow-hidden group hover:border-amber-400 transition-all">
        <div className="absolute top-0 left-0 right-0 h-1 bg-sky-500" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600">Mục tiêu đích đến</span>
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-black text-amber-600">700+</span>
          <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full ml-auto border border-amber-200">
            IIG Format
          </span>
        </div>
        <div className="mt-3 text-xs text-stone-700 space-y-1 border-t border-amber-100 pt-2 font-medium">
          <div className="flex justify-between">
            <span className="text-stone-500">Listening:</span>
            <span className="font-bold text-amber-800">380 – 400 đ (75-80 câu)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Reading:</span>
            <span className="font-bold text-amber-800">330 – 350 đ (68-72 câu)</span>
          </div>
        </div>
      </div>

    </section>
  );
};
