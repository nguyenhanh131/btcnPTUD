# TaskFlow – Ứng dụng quản lý công việc cá nhân
 
TaskFlow là ứng dụng web giúp một người dùng sắp xếp công việc hằng ngày, theo dõi tiến độ, quản lý mức độ ưu tiên và xem thống kê năng suất. Giao diện tối giản, hiện đại, dùng được trên máy tính, máy tính bảng và điện thoại. Dữ liệu được lưu trong cơ sở dữ liệu **Supabase**; nếu chưa cấu hình Supabase, ứng dụng tự lưu vào **localStorage** của trình duyệt.
 
## Chức năng hệ thống
 
### 1. Today – Công việc hôm nay
- Hiển thị công việc đến hạn trong ngày, chia thành ba nhóm: **Quá hạn**, **Đến hạn hôm nay**, **Hoàn thành hôm nay**.
- Tóm tắt tiến độ trong ngày: vòng tròn tiến độ (đã xong / tổng số), số công việc còn lại, đang làm và quá hạn.
- **Thêm nhanh**: nhập tên công việc vào ô phía trên rồi nhấn Enter. Công việc được tạo với hạn là hôm nay, ưu tiên Medium, danh mục Work.
- **Tìm kiếm** theo tên hoặc mô tả.
- **Lọc** theo trạng thái, mức ưu tiên, danh mục.
- **Sắp xếp** theo hạn hoàn thành hoặc theo mức ưu tiên.
### 2. All tasks – Quản lý công việc
- Quản lý **toàn bộ** công việc, không chỉ công việc hôm nay.
- Hai chế độ xem: **Danh sách** và **Board** (ba cột To do, In progress, Completed).
- Thêm, xem, sửa, xóa công việc qua biểu mẫu (trên điện thoại biểu mẫu trượt từ dưới lên).
- Chọn nhanh danh mục bằng các nút phía trên; lọc theo trạng thái, ưu tiên; nút **Overdue only** chỉ hiện công việc quá hạn.
- Đổi trạng thái nhanh bằng cách bấm vào nhãn trạng thái của công việc.
- **Hoàn tác** sau khi xóa (thông báo hiện khoảng 5 giây).
### 3. Statistics – Thống kê năng suất
- Năm chỉ số: **tổng số**, **đã hoàn thành**, **đang chờ**, **quá hạn**, **tỷ lệ hoàn thành**.
- Biểu đồ **phân bố theo trạng thái** (biểu đồ tròn) và **theo mức ưu tiên**.
- Biểu đồ **năng suất theo ngày** (chọn 7, 14 hoặc 30 ngày): số việc hoàn thành và số việc tạo mới mỗi ngày.
- Biểu đồ **năng suất theo tuần** (8 tuần gần nhất, tuần bắt đầu từ thứ Hai).
- **Thống kê theo danh mục**: tổng số, đã xong, quá hạn, tỷ lệ hoàn thành.
- Mọi số liệu được tính trực tiếp từ dữ liệu công việc thực tế.
### Thuộc tính của một công việc
| Thuộc tính | Giá trị |
|---|---|
| Tên | Bắt buộc, tối đa 120 ký tự |
| Mô tả | Tùy chọn |
| Hạn hoàn thành | Tùy chọn. Công việc không có hạn chỉ xuất hiện ở trang All tasks |
| Mức ưu tiên | Low, Medium, High |
| Trạng thái | To do, In progress, Completed |
| Danh mục | Work, Personal, Health, Learning, Finance |
 
**Công việc quá hạn** là công việc có hạn trước hôm nay và chưa hoàn thành. Trạng thái này được tính khi hiển thị, nên luôn đúng khi sang ngày mới.
 
## Hướng dẫn sử dụng
 
1. **Điều hướng**: dùng thanh bên trái (máy tính, máy tính bảng) hoặc thanh tab phía dưới (điện thoại) để chuyển giữa Today, All tasks, Statistics. Bấm một danh mục ở thanh bên để mở All tasks đã lọc theo danh mục đó.
2. **Thêm công việc**: bấm **New task** (hoặc nút `+` trên điện thoại, hoặc nhấn phím `N`), điền thông tin rồi bấm **Save task**. Ở trang Today có thể gõ nhanh rồi nhấn Enter.
3. **Hoàn thành công việc**: bấm ô tròn bên trái công việc. Bấm lại để mở lại công việc.
4. **Đổi trạng thái**: bấm vào nhãn trạng thái (To do → In progress → Completed → To do).
5. **Sửa hoặc xóa**: rê chuột vào công việc rồi bấm biểu tượng bút chì hoặc thùng rác (trên điện thoại các nút luôn hiện). Sau khi xóa có thể bấm **Undo**.
6. **Tìm và lọc**: gõ vào ô Search, chọn bộ lọc và kiểu sắp xếp ở thanh công cụ phía trên danh sách.
7. **Xem thống kê**: mở trang Statistics, chọn 7, 14 hoặc 30 ngày để đổi phạm vi biểu đồ ngày.
## Công nghệ sử dụng
- React 18, TypeScript, Vite
- Tailwind CSS
- Recharts (biểu đồ)
- React Router (HashRouter)
- Supabase (PostgreSQL) và `@supabase/supabase-js`
## Cài đặt và chạy
 
Yêu cầu: Node.js 18 trở lên.
 
```bash
git clone https://github.com/<ten-tai-khoan>/<ten-repo>.git
cd <ten-repo>
npm install
npm run dev
```
 
Mở địa chỉ hiện trong terminal (thường là `http://localhost:5173`). Khi chưa có tệp `.env`, ứng dụng chạy bằng localStorage với dữ liệu mẫu ở lần đầu.
 
Các lệnh khác:
```bash
npm run build     # đóng gói bản chạy thật vào thư mục dist/
npm run preview   # chạy thử bản đã đóng gói
```
 
## Thiết lập cơ sở dữ liệu Supabase
 
1. Trên Supabase Dashboard, vào **SQL Editor > New query**, dán toàn bộ nội dung `supabase/schema.sql` rồi bấm **Run**. Tệp này tạo bảng `categories` và `tasks`, 5 danh mục mặc định, chỉ mục, trigger `updated_at` và các chính sách RLS.
2. (Tùy chọn) Chạy `supabase/seed.sql` **một lần** để có dữ liệu mẫu cho trang Statistics.
3. Vào **Project Settings > API Keys**, copy **Project URL** và **Publishable key**.
4. Tạo tệp môi trường:
```bash
cp .env.example .env
```
   Điền vào `.env`:
```
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-key>
```
5. Khởi động lại `npm run dev`, thêm một công việc rồi kiểm tra bảng `tasks` trong **Table Editor**.
Không đặt Secret key hoặc `service_role` trong `.env`. Tệp `.env` đã nằm trong `.gitignore`.
 
## Cấu trúc dự án
```
src/
  domain/       kiểu dữ liệu, xử lý ngày, bộ lọc, thống kê (hàm thuần)
  data/         TaskRepository, bản localStorage, bản Supabase, client, dữ liệu mẫu
  context/      trạng thái toàn ứng dụng
  components/   TaskRow, TaskForm, FilterBar, Layout, Icon
  pages/        TodayPage, TasksPage, StatsPage
supabase/
  schema.sql    tạo bảng, ràng buộc, RLS
  seed.sql      dữ liệu mẫu (tùy chọn)
```
 
Ứng dụng làm việc với dữ liệu thông qua interface `TaskRepository`. Tệp `src/data/repository.ts` chọn Supabase khi có biến môi trường, ngược lại dùng localStorage, nên phần giao diện không phụ thuộc nơi lưu dữ liệu.
 
## Lưu ý bảo mật
Ứng dụng chưa có đăng nhập, nên mọi người truy cập dùng chung một danh sách công việc. Publishable key nằm trong mã chạy trên trình duyệt, vì vậy ai có khóa đều có thể đọc, sửa, xóa toàn bộ công việc. Cấu hình này phù hợp cho bài tập và trình diễn, không dùng cho dữ liệu thật. Hướng nâng cấp: thêm Supabase Auth, thêm cột `user_id` và RLS theo `auth.uid()`.
 
## Hạn chế hiện tại
- Chưa có đăng nhập và phân quyền theo người dùng.
- Danh sách danh mục cố định, chưa có màn hình quản lý danh mục.
- Chưa có thao tác hàng loạt, kéo thả trên Board, công việc lặp lại và nhắc việc.
 