'use client';

import React, { useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, Eye, EyeOff, LockKeyhole, Target, UserRound } from 'lucide-react';
import { isSupabaseConfigured, supabase } from '@/lib/supabase';

type AuthMode = 'login' | 'signup';

const translateAuthError = (message: string) => {
  if (message.includes('Invalid login credentials')) return 'Tên tài khoản hoặc mật khẩu không đúng.';
  if (message.includes('User already registered')) return 'Tên tài khoản này đã được sử dụng.';
  if (message.includes('Password should be')) return 'Mật khẩu cần có ít nhất 6 ký tự.';
  if (message.includes('Email rate limit')) return 'Bạn thao tác quá nhanh. Hãy thử lại sau ít phút.';
  return message;
};

const normalizeUsername = (value: string) => value.trim().toLowerCase();
const isValidUsername = (value: string) => /^[a-z0-9._-]{3,24}$/.test(value);
const toInternalEmail = (username: string) => `${username}@login.toeic-roadmap.invalid`;

export const AuthScreen: React.FC = () => {
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

    if (!supabase) {
      setError('Supabase chưa được cấu hình.');
      return;
    }

    const normalizedUsername = normalizeUsername(username);
    if (!isValidUsername(normalizedUsername)) {
      setError('Tên tài khoản cần 3–24 ký tự, chỉ gồm chữ thường không dấu, số, dấu chấm, gạch dưới hoặc gạch ngang.');
      return;
    }

    const internalEmail = toInternalEmail(normalizedUsername);

    setIsSubmitting(true);
    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: internalEmail,
          password,
          options: { data: { username: normalizedUsername } },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setError('Supabase đang bật xác nhận email. Hãy tắt Confirm email trong Authentication → Providers → Email để đăng nhập bằng tên tài khoản.');
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: internalEmail, password });
        if (signInError) throw signInError;
      }
    } catch (authError) {
      const message = authError instanceof Error ? authError.message : 'Không thể xác thực tài khoản.';
      setError(translateAuthError(message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSupabaseConfigured) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-12 text-white flex items-center justify-center">
        <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8 shadow-2xl">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950"><AlertCircle className="h-6 w-6" /></div>
          <h1 className="text-2xl font-black">Chưa kết nối cơ sở dữ liệu</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-300">Tạo project Supabase, chạy file <code className="rounded bg-white/10 px-1.5 py-0.5">supabase/schema.sql</code>, rồi khai báo hai biến môi trường dưới đây.</p>
          <pre className="mt-5 overflow-x-auto rounded-xl border border-white/10 bg-slate-900 p-4 text-xs leading-6 text-blue-200">NEXT_PUBLIC_SUPABASE_URL=...{`\n`}NEXT_PUBLIC_SUPABASE_ANON_KEY=...</pre>
          <p className="mt-4 text-xs text-slate-400">Xem hướng dẫn đầy đủ trong README.md. Không đưa secret/service-role key vào mã nguồn.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white flex items-center justify-center">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl lg:grid-cols-[1.08fr_0.92fr]">
        <section className="hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-10 lg:flex lg:flex-col lg:justify-between">
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10"><Target className="h-6 w-6" /></div>
            <h1 className="mt-7 text-3xl font-black leading-tight">TOEIC 700+<br />Study4 Roadmap</h1>
            <p className="mt-4 max-w-sm text-sm leading-6 text-blue-100/80">Đăng nhập một lần để đồng bộ tiến độ, điểm số và ghi chú giữa điện thoại, máy tính và mọi trình duyệt.</p>
          </div>
          <ul className="space-y-3 text-sm text-slate-200">
            {['Mỗi tài khoản có dữ liệu riêng', 'Đồng bộ tự động lên cloud', 'Vẫn có thể sao lưu ra tệp JSON'].map((item) => <li key={item} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />{item}</li>)}
          </ul>
        </section>

        <section className="p-6 text-stone-900 sm:p-10">
          <div className="mb-7 lg:hidden"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white"><Target className="h-5 w-5" /></div><h1 className="mt-3 text-xl font-black">TOEIC 700+ Study4 Roadmap</h1></div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-blue-700">Tài khoản học tập</p>
          <h2 className="mt-2 text-2xl font-black">{mode === 'login' ? 'Chào mừng bạn quay lại' : 'Tạo tài khoản mới'}</h2>
          <p className="mt-1 text-sm text-stone-500">{mode === 'login' ? 'Đăng nhập để tiếp tục đúng tiến độ của bạn.' : 'Tiến độ của bạn sẽ được lưu riêng và đồng bộ online.'}</p>

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
