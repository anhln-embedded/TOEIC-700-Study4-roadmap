'use client';

import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Bell } from 'lucide-react';

interface ExamTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExamTimerModal: React.FC<ExamTimerModalProps> = ({ isOpen, onClose }) => {
  const [selectedMinutes, setSelectedMinutes] = useState(120);
  const [remainingSeconds, setRemainingSeconds] = useState(120 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (interval) clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds]);

  // Play audio beep on completion
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch {
      // AudioContext not allowed or not supported
    }
  };

  const handleSelectMode = (mins: number) => {
    setIsRunning(false);
    setSelectedMinutes(mins);
    setRemainingSeconds(mins * 60);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setRemainingSeconds(selectedMinutes * 60);
  };

  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="bg-white border border-amber-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative text-center" role="dialog" aria-modal="true" aria-labelledby="exam-timer-title">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Đóng đồng hồ"
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 rounded-full bg-stone-100 hover:bg-stone-200 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <h3 id="exam-timer-title" className="text-xl font-black text-stone-900">Đồng Hồ Bấm Giờ Luyện Thi</h3>
        </div>
        <p className="text-xs text-stone-500 mb-6 font-medium">
          Mô phỏng áp lực phòng thi thật tại trung tâm khảo thí IIG
        </p>

        {/* Mode Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {[
            { label: 'Full 120p', mins: 120 },
            { label: 'Reading 75p', mins: 75 },
            { label: 'Listen 45p', mins: 45 },
            { label: 'Pomo 25p', mins: 25 },
          ].map((mode) => (
            <button
              key={mode.mins}
              onClick={() => handleSelectMode(mode.mins)}
              className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedMinutes === mode.mins
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-md shadow-amber-500/25 ring-2 ring-amber-300'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100/70 border border-amber-200'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>

        {/* Big Time Display */}
        <div className="my-6">
          <span className="text-6xl sm:text-7xl font-black tracking-tight text-amber-800 font-mono tabular-nums">
            {timeFormatted}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30 transition-transform active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Bắt Đầu</span>
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm bg-amber-700 hover:bg-amber-800 text-white shadow-lg shadow-amber-700/30 transition-transform active:scale-95 cursor-pointer"
            >
              <Pause className="w-4 h-4 fill-current" />
              <span>Tạm Dừng</span>
            </button>
          )}

          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Làm Lại</span>
          </button>
        </div>

      </div>
    </div>
  );
};
