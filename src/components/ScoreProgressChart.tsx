'use client';

import React from 'react';
import { TrendingUp } from 'lucide-react';
import { UserProgressMap, SCHEDULE_DATA } from '../data/scheduleData';

interface ScoreProgressChartProps {
  progress: UserProgressMap;
}

export const ScoreProgressChart: React.FC<ScoreProgressChartProps> = ({ progress }) => {
  const scoredItems: { day: string; score: number; testName: string; lc?: number | string; rc?: number | string }[] = [];

  SCHEDULE_DATA.forEach((item, index) => {
    const p = progress[index];
    if (p) {
      const total = typeof p.totalScore === 'number' ? p.totalScore : parseInt(String(p.totalScore), 10);
      if (!isNaN(total) && total > 0) {
        scoredItems.push({
          day: item.day_num,
          score: total,
          testName: item.test_name,
          lc: p.lcScore,
          rc: p.rcScore
        });
      }
    }
  });

  if (scoredItems.length === 0) {
    return (
      <div className="bg-white border border-amber-200/80 rounded-2xl p-6 mb-6 shadow-sm text-center">
        <div className="flex items-center justify-center gap-2 text-amber-800 mb-2">
          <TrendingUp className="w-5 h-5 text-amber-600" />
          <h3 className="font-bold text-stone-900 text-base">Biểu Đồ Tăng Trưởng Điểm Số Full Test</h3>
        </div>
        <p className="text-xs text-stone-500 max-w-md mx-auto font-medium">
          Chưa có bài kiểm tra nào được nhập điểm. Hãy làm bài Full Test đầu vào (Ngày 1) và nhập điểm số Listening & Reading để kích hoạt biểu đồ vàng theo dõi tiến độ!
        </p>
      </div>
    );
  }

  // Dimensions
  const height = 190;
  const padding = { top: 30, right: 45, bottom: 35, left: 50 };
  const minScore = 400;
  const maxScore = 990;
  const targetScore = 700;

  const chartH = height - padding.top - padding.bottom;
  const getY = (val: number) => padding.top + chartH - ((val - minScore) / (maxScore - minScore)) * chartH;
  const targetY = getY(targetScore);

  return (
    <div className="bg-white border border-amber-200/80 rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-stone-900 text-base">Biểu Đồ Tăng Trưởng Điểm Số Full Test</h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-red-500 font-bold">
            <span className="w-3.5 h-0.5 bg-red-500 border border-red-500 border-dashed" />
            Đường mốc 700+
          </span>
          <span className="flex items-center gap-1.5 text-amber-800 font-bold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
            Điểm thi thực tế
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <div className="min-w-[620px] h-[190px]">
          <svg className="w-full h-full overflow-visible" viewBox={`0 0 800 ${height}`}>
            
            {/* Gradients */}
            <defs>
              <linearGradient id="scoreAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4979DC" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#4979DC" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* 700 Benchmark Line */}
            <line
              x1={padding.left}
              y1={targetY}
              x2={800 - padding.right}
              y2={targetY}
              stroke="#ef4444"
              strokeWidth="1.8"
              strokeDasharray="5,4"
            />
            <text
              x={800 - padding.right + 8}
              y={targetY + 4}
              fill="#ef4444"
              fontSize="11"
              fontWeight="bold"
            >
              700 Mục tiêu
            </text>

            {/* 500 Baseline Reference */}
            <line
              x1={padding.left}
              y1={getY(500)}
              x2={800 - padding.right}
              y2={getY(500)}
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <text
              x={padding.left - 28}
              y={getY(500) + 4}
              fill="#94a3b8"
              fontSize="10"
              fontWeight="600"
            >
              500
            </text>

            {/* 850 Reference */}
            <line
              x1={padding.left}
              y1={getY(850)}
              x2={800 - padding.right}
              y2={getY(850)}
              stroke="#E2E8F0"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <text
              x={padding.left - 28}
              y={getY(850) + 4}
              fill="#94a3b8"
              fontSize="10"
              fontWeight="600"
            >
              850
            </text>

            {/* Graph Line, Fill & Points */}
            {(() => {
              const chartW = 800 - padding.left - padding.right;
              const getX = (i: number) =>
                padding.left + (scoredItems.length === 1 ? chartW / 2 : (i / (scoredItems.length - 1)) * chartW);

              let pathD = '';
              scoredItems.forEach((pt, i) => {
                const x = getX(i);
                const y = getY(pt.score);
                pathD += i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`;
              });

              const firstX = getX(0);
              const lastX = getX(scoredItems.length - 1);
              const bottomY = padding.top + chartH;
              const areaPathD = `${pathD} L ${lastX} ${bottomY} L ${firstX} ${bottomY} Z`;

              return (
                <>
                  {/* Area fill */}
                  <path d={areaPathD} fill="url(#scoreAreaGradient)" />

                  {/* Stroke path */}
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#4979DC"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Points */}
                  {scoredItems.map((pt, i) => {
                    const x = getX(i);
                    const y = getY(pt.score);
                    const isPassed = pt.score >= 700;
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r="6"
                          fill={isPassed ? "#10B981" : "#4979DC"}
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          className="drop-shadow-sm"
                        />
                        <text
                          x={x}
                          y={y - 12}
                          fill={isPassed ? "#047857" : "#294D9D"}
                          fontSize="11"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          {pt.score}
                        </text>
                        <text
                          x={x}
                          y={height - 10}
                          fill="#78716C"
                          fontSize="10"
                          fontWeight="600"
                          textAnchor="middle"
                        >
                          {pt.day}
                        </text>
                      </g>
                    );
                  })}
                </>
              );
            })()}

          </svg>
        </div>
      </div>
    </div>
  );
};
