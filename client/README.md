# Dự án PointSell Restaurant Manager

Dự án này là quản lý quán ăn được xây dựng bằng React, TypeScript và Vite.

## Chức năng trong dự án

- **Authentication module**: Quản lý bằng JWT

  - Đăng nhập
  - Đăng xuất

- **Quyền các role trong dự án**

  - **Owner**: có quyền thao tác mọi chức năng quản lý trên hệ thống, ngoại trừ việc gọi api order với vai trò là Guest
    - Email: admin@order.com | Mật khẩu: 123456
  - **Employee**: Tương tự Owner nhưng không có chức năng quản lý tài khoản nhân viên
    - Email: employee@example.com | Mật khẩu: 123123
  - **Guest**: Chỉ có quyền tạo order
    - Chỉ cần nhập tên để đăng nhập

- **Trang Dashboard**
  - Thống kê tất cả liên quan tới nhà hàng bao gồm: Tổng doanh thu, số lượng khách, đơn hàng, bàn đang phục vụ
  - Visualization doanh thu, xếp hạng trên biểu đồ
  - Filter theo ngày (mặc định là ngày đăng nhập)
- **Trang quản lý đơn hàng**:
  - Hiển thị thông tin các món ăn mà khách hàng order
  - Thao tác realtime thay đổi trạng thái các món ăn từ ví dụ: chờ xử lý, đang nấu, đã phục vụ.
- **Trang quản lý bàn ăn**:
  - Thêm, sửa, xoá, cập nhật bàn ăn.
  - Có thể share qua link, hoặc QR để Guest vào bàn
- **Trang quản lý msón ăn**:
  - Thêm, sửa, xoá, cập nhật ăn
  - Upload ảnh món ăn
- **Trang quản lý account**:
  - Update thông tin cá nhân
  - Upload Avatar
  - Đổi mật khẩu
- **Trang quản lý nhân viên**:
  - Thêm, sửa, xoá, cập nhật nhân viên
  - Thay đổi quyền nhân viên
  - Khi xoá nhân viên thì logout tài khoản nhân viên ngay lập tức
- **Trang gọi món cho khách**:
  - Khách hàng sau khi đăng nhập có thể gọi món, với các món ăn cùng số lượng mong muốn.
- **Trang theo dõi đơn hàng**:
  - Cho phép hàng theo dõi tiến độ đơn hàng.

Vì đây là một trang web phục vụ tại quầy, do đó khi khách muốn thanh toán sẽ thanh toán với nhân viên

## Công nghệ sử dụng

- **UI / CSS Library**: Tailwindcss + ShadCn/UI
- **State Management**: RTK query cho async state và React Context cho state thường
- **Form Management**: React Hook Form
- **Router**: React Router
- **Build tool**: Vite
- **API**: Rest API dựa trên server được đính kèm
- **Hỗ trợ SEO** với React Helmet
- **Realtime** với socket

## Cài đặt và Khởi chạy

```bash
# Clone repository
git clone https://github.com/AlvinTuan/restaurant_manager
cd shopee-clone

# Cài đặt dependencies
npm install

# Chạy ở môi trường development
npm run dev

# Build cho production
npm run build
```
