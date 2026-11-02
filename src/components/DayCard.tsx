'use client';

import React from 'react';
import { Calendar, Settings, ExternalLink, Award, Sparkles } from 'lucide-react';
import { DaySchedule, DayProgress } from '../data/scheduleData';

interface DayCardProps {
  item: DaySchedule;
  index: number;
  progress?: DayProgress;
  onUpdateScore: (index: number, lc: string, rc: string) => void;
  onUpdateNotes: (index: number, notes: string) => void;
  onUpdateStatus: (index: number, status: 'pending' | 'inprogress' | 'completed') => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  item,
  index,
  progress = { status: 'pending', lcScore: '', rcScore: '', totalScore: '', notes: '' },
  onUpdateScore,
  onUpdateNotes,
  onUpdateStatus
}) => {
  const total = typeof progress.totalScore === 'number'
    ? progress.totalScore
    : parseInt(String(progress.totalScore || ''), 10);
  const isPassed = !isNaN(total) && total >= 700;

  const taskLines = item.tasks.split('\n').filter(t => t.trim() !== '');

  const handleLcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateScore(index, e.target.value, String(progress.rcScore || ''));
  };

  const handleRcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateScore(index, String(progress.lcScore || ''), e.target.value);
  };

  const statusBorderClass =
    progress.status === 'completed'
      ? 'border-l-4 border-l-emerald-500 hover:border-emerald-500'
      : progress.status === 'inprogress'
      ? 'border-l-4 border-l-amber-500 hover:border-amber-500'
      : 'border-l-4 border-l-stone-300 hover:border-stone-400';

  return (
    <article className={`bg-white border border-stone-200 rounded-2xl p-5 shadow-xs hover:shadow-md flex flex-col transition-all duration-200 ${statusBorderClass}`}>
      
      {/* Top Meta Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 text-xs font-black tracking-wider text-amber-800 uppercase">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
            {item.day_num}
          </span>
          <span className="text-stone-300 text-xs">•</span>
          <span className="text-xs font-bold text-stone-600">
            {item.day_of_week}
          </span>
        </div>
        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200">
          {item.week}
        </span>
      </div>

      {/* Test Title */}
      <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2 leading-snug">
        {item.test_name}
      </h3>

      {/* Meta Chips */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
          📚 {item.source}
        </span>
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
          ⚡ {item.mode.split('(')[0].trim()}
        </span>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200">
          ⏱️ {item.duration.split(' ')[0]} {item.duration.includes('tiếng') ? 'tiếng' : 'phút'}
        </span>
      </div>

      {/* Study4 Settings Box */}
      <div className="bg-stone-100/70 border border-stone-200 rounded-xl p-3 mb-3 text-xs text-stone-700 space-y-1">
        <div className="flex items-center gap-1.5 font-black text-amber-900">
          <Settings className="w-3.5 h-3.5 text-amber-700" />
          <span>Cài đặt trên Web Study4:</span>
        </div>
        <p className="text-stone-700 font-medium leading-relaxed pl-5">
          {item.study4_settings}
        </p>
      </div>

      {/* Tasks List */}
      <div className="mb-4 text-xs text-stone-700 flex-1">
        <div className="font-bold text-stone-900 mb-1.5">Nhiệm vụ trọng tâm:</div>
        <ul className="space-y-1.5 pl-4 list-disc text-stone-600 font-medium">
          {taskLines.map((task, i) => (
            <li key={i} className="leading-relaxed">
              {task.replace(/^[0-9]+\.\s*/, '')}
            </li>
          ))}
        </ul>
      </div>

      {/* Score Inputs Row */}
      <div className="bg-stone-100/50 border border-stone-200 rounded-xl p-3 mb-3">
        <div className="grid grid-cols-3 gap-2 items-center">
          
          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 text-center">
              LISTENING
            </label>
            <input
              type="number"
              min="0"
              max="495"
              placeholder="0 - 495"
              value={progress.lcScore || ''}
              onChange={handleLcChange}
              className="w-full text-center py-1.5 px-2 text-xs font-bold rounded-lg bg-white border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 text-center">
              READING
            </label>
            <input
              type="number"
              min="0"
              max="495"
              placeholder="0 - 495"
              value={progress.rcScore || ''}
              onChange={handleRcChange}
              className="w-full text-center py-1.5 px-2 text-xs font-bold rounded-lg bg-white border border-stone-300 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 shadow-2xs"
            />
          </div>

          <div className={`text-center py-1.5 px-2 rounded-lg border transition-all ${
            isPassed
              ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900'
              : 'bg-white border-stone-300 text-stone-700'
          }`}>
            <div className="text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1">
              {isPassed ? <Sparkles className="w-3 h-3 text-emerald-600" /> : <Award className="w-3 h-3 text-amber-700" />}
              <span>TỔNG</span>
            </div>
            <div className="text-sm font-black">
              {!isNaN(total) && total > 0 ? total : '--'}
            </div>
          </div>

        </div>
      </div>

      {/* Notes Textarea (Error Log) */}
      <textarea
        placeholder="Ghi chú lỗi sai hay bẫy cần nhớ..."
        value={progress.notes || ''}
        onChange={(e) => onUpdateNotes(index, e.target.value)}
        rows={2}
        className="w-full text-xs rounded-xl bg-white border border-stone-300 p-2.5 text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 resize-none mb-3 font-medium transition-all"
      />

      {/* Card Footer Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-stone-200 mt-auto">
        
        {/* Status Dropdown */}
        <select
          value={progress.status}
          onChange={(e) => onUpdateStatus(index, e.target.value as 'pending' | 'inprogress' | 'completed')}
          className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer transition-colors ${
            progress.status === 'completed'
              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
              : progress.status === 'inprogress'
              ? 'bg-amber-100 text-amber-900 border-amber-300'
              : 'bg-stone-100 text-stone-700 border-stone-300'
          }`}
        >
          <option value="pending">⏳ Chưa làm</option>
          <option value="inprogress">✍️ Đang làm</option>
          <option value="completed">✅ Đã hoàn thành</option>
        </select>

        {/* Exact Study4 test links */}
        <div className="flex flex-wrap justify-end gap-1.5">
          {(item.study4_links?.length ? item.study4_links : [{ label: 'Mở đề', url: item.study4_link }]).map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Mở đúng đề ${link.label} trên Study4`}
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white shadow-xs transition-colors active:scale-[0.98]"
            >
              <span>{item.study4_links.length === 1 ? 'Mở đúng đề' : link.label}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ))}
        </div>

      </div>

    </article>
  );
};
