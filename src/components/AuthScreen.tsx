'use client';

import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Target, UserRound } from 'lucide-react';

interface AuthScreenProps {
  onSuccess: (user: { id: string; username: string }) => void;
}

type AuthMode = 'login' | 'signup';

const isValidUsername = (value: string) => /^[a-z0-9._-]{3,24}$/.test(value.trim().toLowerCase());

export const AuthScreen: React.FC<AuthScreenProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    setError('');
    setNotice('');
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setNotice('');

    const cleanUser = username.trim().toLowerCase();
    if (!isValidUsername(cleanUser)) {
      setError('Tên tài khoản cần 3–24 ký tự (chữ thường, số, dấu chấm, gạch dưới hoặc gạch ngang).');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu cần ít nhất 6 ký tự.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/toeic/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, username: cleanUser, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Xác thực không thành công.');
      }

      onSuccess(data.user);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể kết nối đến máy chủ.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white flex items-center justify-center">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10"><Target className="h-6 w-6" /></div>
            <h1 className="mt-7 text-3xl font-black leading-tight">TOEIC 700+<br />Study4 Roadmap</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100/80">Lưu trữ lộ trình học tập, lịch ôn luyện và điểm thi trực tiếp trên server riêng của bạn.</p>
          </div>
          <ul className="space-y-3 text-sm text-slate-200">
            {['Mỗi người dùng có dữ liệu riêng biệt', 'Tự động lưu trên cơ sở dữ liệu server', 'Đồng bộ tức thì trên điện thoại và PC'].map((item) => (
              <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{item}</li>
            ))}
          </ul>
        </section>

        <section className="p-6 text-stone-900 sm:p-10">
          <div className="mb-7 lg:hidden"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white"><Target className="h-5 w-5" /></div><h1 className="mt-3 text-xl font-black">TOEIC 700+ Study4 Roadmap</h1></div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Tài khoản học tập</p>
          <h2 className="mt-2 text-2xl font-black">{mode === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}</h2>
          <p className="mt-1 text-sm text-stone-500">{mode === 'login' ? 'Nhập tên tài khoản để tải lộ trình của bạn.' : 'Tài khoản được lưu an toàn trực tiếp trên server.'}</p>

          <div className="mt-6 grid grid-cols-2 rounded-xl bg-stone-100 p-1 text-sm font-bold">
            <button type="button" onClick={() => switchMode('login')} className={`rounded-lg px-3 py-2.5 transition-colors ${mode === 'login' ? 'bg-white text-slate-950 shadow-sm' : 'text-stone-500'}`}>Đăng nhập</button>
            <button type="button" onClick={() => switchMode('signup')} className={`rounded-lg px-3 py-2.5 transition-colors ${mode === 'signup' ? 'bg-white text-slate-950 shadow-sm' : 'text-stone-500'}`}>Tạo tài khoản</button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block text-xs font-bold text-stone-700">Tên tài khoản
              <span className="relative mt-1.5 block"><UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" /><input type="text" value={username} onChange={(event) => setUsername(event.target.value)} required minLength={3} maxLength={24} autoComplete="username" autoCapitalize="none" spellCheck={false} placeholder="Ví dụ: anhln700" className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /></span>
              <span className="mt-1.5 block text-[10px] font-medium text-stone-400">3–24 ký tự: chữ không dấu, số, dấu chấm, _ hoặc -</span>
            </label>
            <label className="block text-xs font-bold text-stone-700">Mật khẩu
              <span className="relative mt-1.5 block"><LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" /><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} required minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} placeholder="Tối thiểu 6 ký tự" className="w-full rounded-xl border border-stone-300 bg-white py-3 pl-10 pr-11 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700" aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></span>
            </label>

            {error && <div role="alert" className="flex gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs leading-relaxed text-rose-700"><AlertCircle className="h-4 w-4 shrink-0" />{error}</div>}
            {notice && <div role="status" className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-800"><CheckCircle2 className="h-4 w-4 shrink-0" />{notice}</div>}

            <button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60">{isSubmitting ? 'Đang xử lý…' : mode === 'login' ? 'Đăng nhập' : 'Tạo tài khoản'}<ArrowRight className="h-4 w-4" /></button>
          </form>
        </section>
      </div>
    </main>
  );
};
