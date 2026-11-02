# TOEIC 700+ Study4 Roadmap

Ứng dụng theo dõi lộ trình luyện TOEIC Listening & Reading trong 8 tuần, hướng tới mốc 700+. Lộ trình sử dụng 20 Full Test thuộc TOEIC LR Collection 3–4 trên Study4, kết hợp lịch học 56 ngày, đồng hồ thi thử và cẩm nang theo từng dạng câu hỏi.

## Tính năng chính

- Lộ trình 8 tuần, chia thành 56 ngày học và chữa đề.
- Liên kết trực tiếp đến đúng từng Full Test trên Study4.
- Theo dõi trạng thái chưa làm, đang làm và đã hoàn thành.
- Nhập điểm Listening, Reading và theo dõi tiến bộ theo thời gian.
- Ghi chú lỗi sai cho từng ngày học.
- Bộ lọc theo tuần, trạng thái, hình thức học và từ khóa.
- Đồng hồ mô phỏng thời gian làm bài 120 phút.
- Cẩm nang 43 dạng câu hỏi thuộc TOEIC Part 1–7.
- Giao diện sáng/tối và bố cục responsive.
- Sao lưu và phục hồi tiến độ bằng tệp JSON.

## Công nghệ

- Next.js 16 với App Router và Turbopack
- React 19
- TypeScript
- Tailwind CSS 4
- Lucide React

## Chạy dự án

Yêu cầu Node.js 20 trở lên.

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Nếu cổng 3000 đang được sử dụng, Next.js sẽ tự chọn cổng kế tiếp.

## Kiểm tra và build

```bash
npm run lint
npm run build
npm run start
```

Trên Windows PowerShell có chính sách chặn `npm.ps1`, có thể dùng lệnh tương đương:

```powershell
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```

## Dữ liệu người dùng

Tiến độ, điểm số, ghi chú và lựa chọn giao diện được lưu trong `localStorage` của trình duyệt. Ứng dụng không gửi dữ liệu học tập đến máy chủ. Hãy dùng nút **Sao lưu** định kỳ để tải dữ liệu ra tệp JSON.

Khi thay trình duyệt, xóa dữ liệu trang hoặc dùng thiết bị khác, hãy dùng nút **Phục hồi** và chọn tệp sao lưu trước đó.

## Cấu trúc chính

```text
src/
├── app/
│   ├── globals.css       # Theme và style toàn cục
│   ├── layout.tsx        # Metadata và root layout
│   └── page.tsx          # Trạng thái và màn hình chính
├── components/           # Các thành phần giao diện
└── data/
    └── scheduleData.ts   # Lộ trình 56 ngày và liên kết đề
```

## Nguồn tham khảo

- [ETS TOEIC Preparation](https://www.ets.org/toeic/test-takers/prepare.html)
- [Kho đề TOEIC Study4](https://study4.com/tests/toeic/)
- [Các dạng câu hỏi TOEIC Listening](https://study4.com/posts/2446/cac-dang-cau-hoi-thuong-gap-trong-toeic-listening/)
- [Các dạng câu hỏi TOEIC Reading](https://study4.com/posts/2447/cac-dang-cau-hoi-thuong-gap-trong-toeic-reading/)

Các liên kết đề trong lộ trình trỏ tới tài nguyên bên thứ ba và có thể thay đổi khi Study4 cập nhật hệ thống.

## Lưu ý khi phát triển

Nếu Next.js báo hydration mismatch kèm các thuộc tính như `bis_skin_checked`, `bis_register` hoặc `data-yd-*`, hãy kiểm tra tiện ích VPN, dịch trang hoặc bảo mật của trình duyệt. Đây thường là thuộc tính do extension chèn vào DOM, không phải do ứng dụng tạo ra.

## Giấy phép

Dự án hiện được sử dụng cho mục đích học tập cá nhân. Nội dung và đề thi liên kết bên ngoài thuộc quyền sở hữu của đơn vị cung cấp tương ứng.
