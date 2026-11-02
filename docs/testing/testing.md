# QA/QC (Tester)

 Tầng 1: Code đến đâu, chạy Unit Test đến đó (Dev tự làm)

• Họ test thế nào: Đây là việc kiểm tra các hàm/chức năng nhỏ nhất trong mã nguồn (ví dụ: hàm tính tổng tiền giỏ hàng, hàm kiểm tra email hợp lệ). Dev viết code để tự chạy kiểm tra code của mình.
• Thời điểm: Chạy liên tục mỗi khi code trên các nhánh feature/ hoặc trước khi gộp vào dev.
• Công cụ phổ biến:
 • Web/Node.js: Jest, Mocha, Vitest.
 • Java: JUnit.
 • Python: PyTest.

 Tầng 2: Gộp vào release/v1.0 – Giai đoạn Test Độc Lập (QA/Tester làm chính)

Khi bạn tách nhánh release/v1.0, đây là lúc code được đóng băng (không thêm tính năng mới) để đội QA (Quality Assurance) nhảy vào "phá" phần mềm nhằm tìm lỗi qua 3 bước:
• API Testing (Kiểm thử hệ thống ngầm):
 • Cách làm: Kiểm tra xem server phản hồi đúng không, bảo mật tốt không khi gửi dữ liệu.
 • Công cụ: Postman, Insomnia.
• UI/Functional Testing (Kiểm thử giao diện & tính năng):
 • Cách làm: Bấm thử mọi nút bấm, điền form sai, thanh toán thử... xem ứng dụng có chạy đúng logic không.
 • Công cụ: Thực hiện thủ công (Manual Test) kết hợp viết script tự động (Automation Test) bằng Cypress, Playwright, hoặc Selenium.
• Integration Testing (Kiểm thử tích hợp):
 • Cách làm: Kiểm tra xem các tính năng khi ghép lại với nhau có xung đột không (ví dụ: Tính năng Đăng nhập kết hợp với Lưu giỏ hàng có bị mất data không).

 Tầng 3: Staging Environment (Chạy thử như thật)

Trước khi đưa lên nhánh main để người dùng thật sử dụng, code từ nhánh release/ sẽ được deploy (triển khai) lên một môi trường chạy thử gọi là Staging.
• Họ test thế nào: Môi trường Staging có cấu hình máy chủ và dữ liệu giống hệt 99% so với môi trường thực tế (Production). Đội dự án sẽ test tổng thể lần cuối tại đây để đảm bảo không có lỗi phát sinh do cấu hình hệ thống.

Hệ thống tự động hóa tất cả: CI/CD (DevOps)

Trong thực tế, không ai ngồi chạy thủ công hàng nghìn bài test đó mỗi ngày. Các công ty dùng hệ thống CI/CD (Continuous Integration/Continuous Deployment):
text
Bạn Push code lên `release/v1.0`
   ➔ Hệ thống tự động kích hoạt (Trigger)
   ➔ Tự chạy Unit Test
   ➔ Tự chạy Automation Test UI
   ➔ Nếu PASS (Xanh) ➔ Mới cho phép Merge vào `main` để Release.
   ➔ Nếu FAIL (Đỏ) ➔ Báo lỗi, chặn không cho Release, Dev phải vào sửa.
Hãy thận trọng khi sử dụng mã.
• Công cụ CI/CD phổ biến: GitHub Actions, GitLab CI/CD, Jenkins.
Trong dự án hiện tại của bạn, bạn đang viết code bằng ngôn ngữ hay framework nào (Node.js, React, Python...)? Tôi có thể gợi ý công cụ viết file test đơn giản nhất cho công nghệ đó.
