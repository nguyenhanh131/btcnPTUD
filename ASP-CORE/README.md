# ASP-CORE: Website kho phim trực tuyến bằng ASP.NET Core MVC

Bài thực hành môn **Phát triển ứng dụng Thương mại điện tử**, Trường Đại học Kinh tế TP.HCM (UEH). Giảng viên hướng dẫn: TS Nguyễn Mạnh Tuấn.

- **Sinh viên:** Nguyễn Hồng Hạnh
- **MSSV:** 31241028417
- **Lớp học phần:** 26C1INF50902701
- **Website đã triển khai:** http://uehptud31241028417.somee.com/

## Giới thiệu

Website kho phim trực tuyến cho phép khách hàng xem danh sách sản phẩm theo thể loại, thêm vào giỏ hàng, thanh toán và nhận email xác nhận đơn hàng. Quản trị viên có thể thêm, sửa, xóa sản phẩm và thể loại, đồng thời upload hình ảnh cho từng sản phẩm.

## Công nghệ sử dụng

- ASP.NET Core MVC, .NET 5.0
- Entity Framework Core 5 với SQL Server
- ASP.NET Core Identity (đăng ký, đăng nhập)
- Session lưu giỏ hàng, Newtonsoft.Json để chuyển đổi dữ liệu
- Bootstrap 4 cho giao diện thích ứng màn hình
- Gửi email bằng SmtpClient qua Gmail (App Password)
- Hosting: somee.com, cơ sở dữ liệu MS SQL trên somee.com

## Chức năng chính

- Quản lý sản phẩm: xem danh sách, xem chi tiết, thêm, sửa, xóa
- Quản lý thể loại
- Upload và hiển thị hình ảnh sản phẩm (ảnh mặc định khi chưa có ảnh)
- Trang chủ có lọc theo thể loại
- Giỏ hàng: thêm, xóa, cập nhật số lượng và tổng tiền
- Checkout: nhập thông tin giao hàng, lưu đơn hàng vào CSDL, gửi email xác nhận
- Đăng ký, đăng nhập, đăng xuất

## Cấu trúc thư mục

```
ASP-CORE/
├── Controllers/        MoviesController (sản phẩm, giỏ hàng, checkout), GenresController, HomeController
├── Data/               ApplicationDbContext
├── Extension/          EmailServiceNew (gửi email), SessionExtensions (lưu giỏ hàng vào Session)
├── Models/             Movie, Genre, HoaDon, ChiTietHoaDon, ShippingDetail
├── Validation/         GenreAttribute và các attribute kiểm tra dữ liệu
├── Views/              Movies, Genres, Shared (layout, đăng nhập)
├── Migrations/         Lịch sử migration của EF Core
├── wwwroot/
│   ├── css/            site.css
│   └── images/         Ảnh sản phẩm và no-image.jpg
├── appsettings.example.json
└── Startup.cs
```

## Cài đặt và chạy thử trên máy

**Yêu cầu:** .NET 5 SDK, VS Code (có extension C#), tài khoản CSDL SQL Server (có thể dùng somee.com).

1. Clone repository:

```bash
git clone https://github.com/nguyenhanh131/btcnPTUD
```

2. Tạo file cấu hình từ file mẫu:

```bash
cp appsettings.example.json appsettings.json
```

Mở `appsettings.json` và điền:
- `DefaultConnection`: chuỗi kết nối tới CSDL SQL Server của bạn.
- `Email:Address`: địa chỉ Gmail dùng để gửi email.
- `Email:AppPassword`: App Password 16 ký tự, tạo tại https://myaccount.google.com/apppasswords (cần bật xác minh 2 bước).

Không commit file `appsettings.json` lên GitHub.

3. Khôi phục gói và cập nhật CSDL:

```bash
dotnet restore
dotnet ef database update
```

4. Chạy ứng dụng:

```bash
dotnet run
```

Mở trình duyệt tại địa chỉ hiển thị trong Terminal (ví dụ `https://localhost:5001`).

## Triển khai lên hosting

1. Publish:

```bash
dotnet publish -c Release -o ./publish
```

2. Nén nội dung bên trong thư mục `publish` thành `publish.zip`, để `web.config` nằm ở gốc file zip.
3. Trên somee.com, tạo website, mở File manager, xóa `default.asp`, upload `publish.zip` và chọn Upload and Unzip archives.

File `appsettings.json` trong bản publish chứa chuỗi kết nối thật. Chỉ upload lên hosting của chính mình.

## Lưu ý bảo mật

- Không đưa `appsettings.json`, App Password hay chuỗi kết nối thật lên repository.
- Chức năng quản trị hiện chưa có phân quyền, sẽ được bổ sung trong phiên bản sau.

## Hạn chế và hướng phát triển

- Chưa phân quyền quản trị (cần thêm vai trò Admin).
- Chưa liên kết `ShippingDetail` với `HoaDon` bằng khóa ngoại.
- Chưa có trạng thái đơn hàng và cổng thanh toán.
- Ảnh đang lưu trong `wwwroot/images`, nên có thể chuyển sang dịch vụ lưu trữ ngoài.
- Nâng cấp lên .NET LTS mới hơn và dùng MailKit thay cho SmtpClient.