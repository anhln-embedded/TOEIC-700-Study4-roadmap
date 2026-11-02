import { NextRequest, NextResponse } from 'next/server';
import { getUser, updateUserProgress } from '../../../lib/serverDb';

export async function GET(req: NextRequest) {
  try {
    const username = req.nextUrl.searchParams.get('username') || req.cookies.get('toeic_user')?.value;
    if (!username) {
      return NextResponse.json({ success: false, error: 'Chưa xác thực người dùng.' }, { status: 401 });
    }

    const user = getUser(username);
    if (!user) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy người dùng.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        progress: user.progress || {},
        theme: user.theme || 'light',
      },
    });
  } catch (error) {
    console.error('Error reading progress:', error);
    return NextResponse.json({ success: false, error: 'Lỗi tải dữ liệu người dùng.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username: bodyUsername, progress, theme } = body;
    const username = bodyUsername || req.cookies.get('toeic_user')?.value;

    if (!username) {
      return NextResponse.json({ success: false, error: 'Chưa xác thực người dùng.' }, { status: 401 });
    }

    const updated = updateUserProgress(username, progress || {}, theme || 'light');
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Không tìm thấy người dùng.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { progress, theme } });
  } catch (error) {
    console.error('Error saving progress:', error);
    return NextResponse.json({ success: false, error: 'Lỗi lưu dữ liệu lên máy chủ.' }, { status: 500 });
  }
}
