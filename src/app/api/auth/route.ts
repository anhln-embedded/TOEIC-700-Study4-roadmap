import { NextRequest, NextResponse } from 'next/server';
import { createUser, verifyUser } from '../../../lib/serverDb';

export async function POST(req: NextRequest) {
  try {
    const { action, username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Vui lòng nhập tên tài khoản và mật khẩu.' }, { status: 400 });
    }

    const cleanUser = username.trim().toLowerCase();
    if (!/^[a-z0-9._-]{3,24}$/.test(cleanUser)) {
      return NextResponse.json(
        { success: false, error: 'Tên tài khoản cần từ 3–24 ký tự (chữ thường, số, dấu chấm, gạch dưới, gạch ngang).' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json({ success: false, error: 'Mật khẩu cần tối thiểu 6 ký tự.' }, { status: 400 });
    }

    if (action === 'signup') {
      try {
        const newUser = createUser(cleanUser, password);
        const response = NextResponse.json({
          success: true,
          user: { id: newUser.id, username: newUser.username },
          data: { progress: newUser.progress, theme: newUser.theme },
        });
        response.cookies.set('toeic_user', cleanUser, {
          httpOnly: false,
          path: '/',
          maxAge: 60 * 60 * 24 * 365,
        });
        return response;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Tài khoản đã tồn tại.';
        return NextResponse.json({ success: false, error: msg }, { status: 400 });
      }
    } else if (action === 'login') {
      const user = verifyUser(cleanUser, password);
      if (!user) {
        return NextResponse.json({ success: false, error: 'Tên tài khoản hoặc mật khẩu không chính xác.' }, { status: 401 });
      }
      const response = NextResponse.json({
        success: true,
        user: { id: user.id, username: user.username },
        data: { progress: user.progress, theme: user.theme },
      });
      response.cookies.set('toeic_user', cleanUser, {
        httpOnly: false,
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
      });
      return response;
    }

    return NextResponse.json({ success: false, error: 'Hành động không hợp lệ.' }, { status: 400 });
  } catch (e) {
    console.error('Auth API error:', e);
    return NextResponse.json({ success: false, error: 'Lỗi hệ thống máy chủ.' }, { status: 500 });
  }
}
