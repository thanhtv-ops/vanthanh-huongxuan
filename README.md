# Thiệp cưới online: Văn Thành & Hương Xuân

Trang web tĩnh (HTML, CSS, JS), không cần cài đặt hay build.

## Cấu trúc
- `index.html`: nội dung trang
- `style.css`: giao diện (màu và font nằm ở khối `:root` đầu file)
- `script.js`: đếm ngược và nút sao chép địa chỉ
- `images/`: ảnh cưới (thêm sau)

## Xem thử trên máy
Mở `index.html` bằng trình duyệt, hoặc chạy `python3 -m http.server` rồi vào http://localhost:8000.

## Đưa lên mạng miễn phí
- Netlify: kéo thả cả thư mục (hoặc nối repo GitHub) tại app.netlify.com
- Cloudflare Pages: Direct Upload hoặc nối repo GitHub

## Cập nhật thông tin
Sửa ngày giờ và địa điểm trong `index.html`. Ngày đếm ngược nằm ở đầu `script.js` (múi giờ +07:00).

## Ảnh
- `images/*-lg.jpg`: bản lớn (1600px) dùng khi bấm xem ảnh và ảnh bìa
- `images/*-sm.jpg`: bản nhỏ (800px) dùng trong album để tải nhanh
- Thêm ảnh mới: tạo hai bản `-sm` và `-lg`, rồi thêm thẻ `<figure class="ph reveal">` vào chương mong muốn trong `index.html`.
- Sau khi có link chính thức, đổi `og:image` trong `index.html` thành địa chỉ đầy đủ (ví dụ `https://ten-ban-chon.netlify.app/images/ha1-lg.jpg`) để Zalo hiện ảnh xem trước.
