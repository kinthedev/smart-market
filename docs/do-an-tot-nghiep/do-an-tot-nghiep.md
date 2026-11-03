# Đồ án tốt nghiệp

# TỔNG HỢP ĐỒ ÁN TỐT NGHIỆP — SMARTMARKET

**Trạng thái:** Đã chốt hướng dự án, chưa chốt SRS và thiết kế chi tiết.

**Thời gian thực hiện:** 3 tháng (12 tuần).

**Hình thức:** Dự án Full-stack, phát triển cá nhân.

**Định hướng:** Xây dựng sản phẩm thương mại thực tế, nghiên cứu thuật toán và học chuyên sâu Software Engineering thông qua những vấn đề phát sinh trong quá trình phát triển.

---

# I. MỤC TIÊU CỦA TÔI

Tôi là một lập trình viên đang theo hướng Full-stack, chủ yếu sử dụng JavaScript/TypeScript, React, Express và Prisma.

Tôi có khả năng lập trình các chức năng, phân tích luồng nghiệp vụ và tự tìm hiểu công nghệ. Tuy nhiên, tôi muốn cải thiện khả năng Software Engineering, đặc biệt là:

- Phân tích yêu cầu thực tế.
- Thiết kế hệ thống và tổ chức code.
- Đưa ra quyết định kỹ thuật phù hợp.
- Xử lý những trường hợp đặc biệt (edge cases).
- Hiểu và áp dụng các kiến thức backend nâng cao.
- Giải quyết concurrency, consistency, security và reliability.
- Kiểm thử, tối ưu hiệu năng và vận hành hệ thống.
- Có khả năng tiếp cận những yêu cầu chưa từng gặp trong công việc.

Tôi không muốn làm đồ án chỉ để hoàn thành chức năng CRUD và có điểm tốt nghiệp.

**Mục tiêu lớn nhất là sử dụng SmartMarket như một môi trường học tập thực chiến, giúp tôi nâng cao năng lực Full-stack và tư duy Software Engineering trong 3 tháng.**

Tôi muốn khi gặp một yêu cầu mới có thể chủ động:

**Phân tích → Nghiên cứu → Thiết kế → Triển khai → Kiểm thử → Đánh giá.**

Ngoài ra, đồ án cần có giá trị portfolio để đưa vào CV và sử dụng khi ứng tuyển thực tập hoặc công việc Full-stack.

---

# II. TÊN VÀ MÔ TẢ DỰ ÁN

## 1. Tên dự án

**SmartMarket & Trend Intelligence Hub**

Tên tiếng Việt đề xuất:

**Xây dựng nền tảng thương mại điện tử đa nhà bán hàng tích hợp hệ thống gợi ý sản phẩm thông minh.**

Có thể điều chỉnh tên chính thức theo yêu cầu của giảng viên hướng dẫn.

## 2. Mô tả tổng quan

SmartMarket là nền tảng thương mại điện tử đa nhà bán hàng (Multi-vendor Marketplace), cho phép nhiều cửa hàng kinh doanh sản phẩm trên cùng một hệ thống.

Khách hàng có thể tìm kiếm sản phẩm, xem gian hàng, thêm sản phẩm vào giỏ, đặt hàng, thanh toán thử nghiệm, theo dõi đơn hàng và nhận gợi ý cá nhân hóa.

Người bán có dashboard để quản lý cửa hàng, sản phẩm, tồn kho, đơn hàng và theo dõi hoạt động kinh doanh.

Quản trị viên có thể quản lý người dùng, cửa hàng, danh mục và giám sát hệ thống.

Điểm khác biệt của SmartMarket so với website e-commerce CRUD thông thường là:

1. Có hệ thống gợi ý sản phẩm dựa trên thuật toán và dữ liệu hành vi người dùng.
2. Có các bài toán Software Engineering nâng cao được tích hợp trực tiếp vào nghiệp vụ.
3. Có nghiên cứu, thực nghiệm, kiểm thử và đánh giá kết quả bằng số liệu.
4. Được phát triển theo hướng một hệ thống có thể triển khai và vận hành thực tế.

**Phạm vi:** Một marketplace thu nhỏ nhưng có chiều sâu kỹ thuật, không phải xây dựng bản sao hoàn chỉnh của Shopee.

---

# III. BA TRỤ CỘT CHÍNH CỦA ĐỒ ÁN

## 1. COMMERCE — HỆ THỐNG THƯƠNG MẠI

Đây là phần sản phẩm chính, cung cấp các nghiệp vụ mua bán thực tế.

### Customer — Người mua

Các chức năng dự kiến:

- Đăng ký, đăng nhập và đăng xuất.
- Quản lý tài khoản.
- Đổi mật khẩu.
- Quản lý phiên đăng nhập trên các thiết bị.
- Tìm kiếm và lọc sản phẩm.
- Xem thông tin sản phẩm, biến thể và cửa hàng.
- Quản lý giỏ hàng.
- Đặt hàng và checkout.
- Thanh toán mô phỏng hoặc sandbox.
- Theo dõi trạng thái đơn hàng.
- Xem lịch sử mua hàng.
- Đánh giá sản phẩm.
- Nhận gợi ý sản phẩm cá nhân hóa.

### Seller — Người bán

Các chức năng dự kiến:

- Đăng ký gian hàng.
- Quản lý thông tin cửa hàng.
- Quản lý sản phẩm và biến thể.
- Quản lý giá bán.
- Quản lý tồn kho.
- Xử lý đơn hàng.
- Xem doanh thu và thống kê cơ bản.
- Quản lý nhân viên và phân quyền trong cửa hàng nếu đủ thời gian.

### Admin — Quản trị viên

Các chức năng dự kiến:

- Quản lý người dùng.
- Xét duyệt hoặc quản lý gian hàng.
- Quản lý danh mục sản phẩm.
- Giám sát đơn hàng và hoạt động hệ thống.
- Theo dõi thống kê tổng quan.

Một số tính năng có thể được cắt giảm hoặc đơn giản hóa sau khi xây dựng SRS để đảm bảo hoàn thành trong 12 tuần.

## 2. RESEARCH — NGHIÊN CỨU KHOA HỌC

**Hướng nghiên cứu chính đã chọn: Recommendation System.**

Đề tài nghiên cứu dự kiến:

*Xây dựng và đánh giá hệ thống gợi ý sản phẩm cá nhân hóa trên nền tảng thương mại điện tử đa nhà bán hàng.*

Các phương pháp dự kiến nghiên cứu:

**A. Popularity-based Recommendation**

Gợi ý các sản phẩm phổ biến theo lượt xem, lượt mua hoặc những chỉ số phù hợp khác.

Đây là phương pháp baseline để so sánh.

**B. Content-based Filtering**

Gợi ý sản phẩm dựa trên đặc điểm và nội dung của sản phẩm mà người dùng quan tâm.

Ví dụ: Người dùng thường xem laptop gaming thì hệ thống ưu tiên những sản phẩm có đặc điểm tương tự.

**C. Collaborative Filtering**

Gợi ý dựa trên tương quan hành vi hoặc sở thích giữa những người dùng.

Ví dụ: Những người có hành vi tương đồng thường quan tâm đến các nhóm sản phẩm tương tự.

### Dữ liệu phục vụ nghiên cứu

Các sự kiện có thể được thu thập:

- Product view.
- Product click.
- Search.
- Add to cart.
- Purchase.
- Product rating.

Có thể sử dụng bộ dữ liệu nghiên cứu công khai phù hợp nếu dữ liệu thực tế từ SmartMarket chưa đủ. Cần xác định nguồn dữ liệu, cách tiền xử lý và phương pháp chia tập đánh giá rõ ràng.

### Đánh giá nghiên cứu

Các chỉ số dự kiến:

- Precision@K.
- Recall@K.
- NDCG@K.
- Thời gian suy luận.
- Khả năng xử lý cold-start.

Cần thiết kế thực nghiệm có baseline, dữ liệu đánh giá và tiêu chí so sánh rõ ràng. Không khẳng định phương pháp nào tốt hơn khi chưa có kết quả.

**Phân tích xu hướng tìm kiếm hoặc sản phẩm thịnh hành** có thể được xây dựng như một tính năng phụ.

Demand Forecasting và NLP Sentiment Analysis không thuộc phạm vi bắt buộc trong 3 tháng.

## 3. ENGINEERING — CÁC BÀI LAB SOFTWARE ENGINEERING

Các bài lab là phần đặc biệt quan trọng của dự án.

Chúng không phải project riêng mà được tích hợp vào nghiệp vụ SmartMarket.

### Lab 01 — Authentication & Session Management

Bài toán:

Người dùng đăng nhập trên nhiều thiết bị. Khi thay đổi mật khẩu, các phiên đăng nhập trên thiết bị khác phải bị thu hồi theo chính sách đã xác định.

Kiến thức:

- Authentication và Authorization.
- Cookie security.
- Server-side sessions.
- Session lifecycle.
- Session revocation.
- Password hashing.
- Session rotation.
- CSRF.
- Rate limiting.

Yêu cầu kiểm thử: Session đã bị thu hồi phải bị server từ chối ở request tiếp theo, ngay cả khi cookie vẫn tồn tại.

### Lab 02 — RBAC & Multi-tenancy

Bài toán:

Marketplace có nhiều shop, mỗi shop có dữ liệu riêng. Người của Shop A không được xem hoặc chỉnh sửa dữ liệu của Shop B.

Kiến thức:

- RBAC.
- Authorization.
- Object-level permission.
- Tenant isolation.
- IDOR.
- Ownership validation.

Yêu cầu kiểm thử: Thay đổi ID trong API request không được phép vượt quyền truy cập.

### Lab 03 — Inventory Concurrency

Đây là một lab trọng tâm.

Bài toán:

Kho còn 10 sản phẩm nhưng có 100 request đặt hàng gần như đồng thời.

Hệ thống phải ngăn overselling.

Kiến thức:

- Race condition.
- ACID transactions.
- Atomic conditional update.
- Optimistic concurrency control.
- Row-level locking.
- Isolation levels.
- Database consistency.

Các cấp độ thực hành:

1. Cố tình xây dựng cách cập nhật không an toàn để tái hiện lỗi.
2. Xây dựng giải pháp cập nhật có điều kiện.
3. Nghiên cứu và so sánh các chiến lược locking/concurrency.
4. Chạy load test để chứng minh kết quả.

### Lab 04 — Inventory Reservation & Order State Machine

Bài toán:

Khách đặt hàng thành công nhưng chưa thanh toán. Hàng cần được giữ tạm thời.

Nếu thanh toán thất bại hoặc hết hạn, hệ thống phải giải phóng reservation đúng cách.

Kiến thức:

- State machine.
- Business invariants.
- Reservation lifecycle.
- Transaction rollback.
- Expiration handling.
- Consistency.

Các model dự kiến:

- Inventory.
- InventoryReservation.
- StockMovement.
- Order.

Quy tắc khái niệm:

`available = onHand - reserved`

Cần duy trì các invariant để tránh tồn kho âm, bán vượt số lượng và giải phóng hàng nhiều lần.

### Lab 05 — Idempotency & Payment Reliability

Bài toán:

Người dùng nhấn thanh toán nhiều lần, request timeout hoặc webhook thanh toán được gửi lặp lại.

Kiến thức:

- Idempotency keys.
- Webhook signature verification.
- Retry-safe processing.
- Deduplication.
- Payment state machine.
- Reconciliation.

Mục tiêu: Không tạo đơn hoặc ghi nhận giao dịch trùng lặp do cùng một thao tác bị retry.

Dùng payment simulator hoặc sandbox, không cần giao dịch tiền thật.

### Lab 06 — Background Jobs & Failure Recovery

Bài toán:

Đơn hàng được tạo nhưng dịch vụ email hoặc notification tạm thời gặp lỗi.

Kiến thức:

- Queue.
- Worker.
- Retry.
- Exponential backoff.
- Failed jobs.
- Transactional outbox.

Mục tiêu: Không làm mất đơn hàng, có thể xử lý lại công việc thất bại và hạn chế tác dụng phụ trùng lặp.

### Lab 07 — Caching & Performance

Bài toán:

API tìm kiếm, danh sách sản phẩm hoặc dashboard phản hồi chậm khi dữ liệu tăng.

Kiến thức:

- Redis caching.
- Cache invalidation.
- Database indexing.
- Query optimization.
- EXPLAIN ANALYZE.
- Pagination.
- Load testing.
- p95 latency.

Mục tiêu: Đo hiệu năng trước và sau tối ưu, có số liệu chứng minh.

### Lab 08 — Security Testing

Kiểm tra:

- Authentication bypass.
- Broken authorization.
- IDOR.
- CSRF.
- Session revocation.
- Input validation.
- Rate limiting.

Tham khảo OWASP và PortSwigger Web Security Academy.

### Lab 09 — Recommendation Engineering

Bài toán:

Hệ thống phải kết hợp kết quả thuật toán gợi ý với dữ liệu sản phẩm thực tế.

Kiến thức:

- Event tracking.
- Data preprocessing.
- Recommendation pipeline.
- Offline evaluation.
- Cold-start handling.
- API integration.

### Lab 10 — Deployment & Production

Kiến thức:

- Docker.
- CI/CD.
- Environment variables.
- Structured logging.
- Error handling.
- Health checks.
- Monitoring.
- Database migrations.
- Backup và recovery.
- Automated testing.

Mục tiêu là triển khai SmartMarket để người khác có thể dùng thử, đồng thời có quy trình kiểm thử và vận hành cơ bản.

---

# IV. CÔNG NGHỆ VÀ KIẾN TRÚC DỰ KIẾN

Do thời gian thực hiện chỉ có 3 tháng, ưu tiên sử dụng stack quen thuộc để tập trung học kiến trúc và xử lý nghiệp vụ.

| Thành phần              | Công nghệ dự kiến                              |
| ----------------------- | ---------------------------------------------- |
| Frontend                | Next.js, React, TypeScript                     |
| Styling                 | Tailwind CSS                                   |
| Server state            | TanStack Query khi phù hợp                     |
| Backend                 | Node.js, Express hoặc NestJS, TypeScript       |
| Validation              | Zod hoặc giải pháp tương đương                 |
| Database                | PostgreSQL                                     |
| ORM                     | Prisma                                         |
| Cache / Queue           | Redis, BullMQ                                  |
| Research                | Python, scikit-learn và các thư viện cần thiết |
| Research API            | FastAPI nếu cần                                |
| Unit / Integration Test | Vitest, Supertest                              |
| E2E Test                | Playwright                                     |
| Load Test               | k6                                             |
| Deployment              | Docker, GitHub Actions, hosting phù hợp        |

### Kiến trúc

**Modular Monolith** cho backend thương mại.

Các module dự kiến:

- Auth.
- Users.
- Shops.
- Products.
- Cart.
- Inventory.
- Orders.
- Payments.
- Notifications.
- Recommendations integration.

Phần Recommendation có thể triển khai bằng Python và tích hợp qua API hoặc batch processing tùy nhu cầu thực tế.

Không bắt buộc sử dụng microservices, Kafka, Kubernetes hoặc MongoDB.

Không sử dụng công nghệ chỉ để làm project trông phức tạp.

**Nguyên tắc:** Chỉ thêm công nghệ khi có vấn đề thực tế cần nó giải quyết.

---

# V. LỘ TRÌNH THỰC HIỆN — 12 TUẦN

## Tháng 1 — Commerce Foundation

**Tuần 1–2:**

- Khảo sát và phân tích yêu cầu.
- Xây dựng SRS.
- Xác định actors và use cases.
- Thiết kế kiến trúc hệ thống.
- Thiết kế ERD.
- Tạo repository và cấu trúc dự án.
- Triển khai Authentication, Sessions, RBAC cơ bản.

**Tuần 3–4:**

- Quản lý shop.
- Quản lý sản phẩm và biến thể.
- Danh mục sản phẩm.
- Giỏ hàng.
- Checkout cơ bản.

Mục tiêu: Có nền tảng thương mại vận hành được.

## Tháng 2 — Advanced Commerce & Engineering

**Tuần 5–6:**

- Quản lý đơn hàng.
- Tồn kho.
- Concurrency control.
- Inventory reservation.
- Order state machine.
- Payment simulator/sandbox.
- Idempotency.

**Tuần 7–8:**

- Hoàn thiện các luồng nghiệp vụ.
- Background jobs theo ưu tiên.
- Thu thập hành vi người dùng.
- Dashboard cơ bản.
- Integration tests.

Mục tiêu: Hệ thống có thể demo quy trình mua bán end-to-end.

## Tháng 3 — Research & Production

**Tuần 9–10:**

- Xây dựng hệ thống Recommendation.
- Tiền xử lý dữ liệu.
- Huấn luyện/xây dựng phương pháp gợi ý.
- Chạy thực nghiệm và đánh giá.
- Kiểm thử concurrency, security và performance.

**Tuần 11–12:**

- Tối ưu hệ thống.
- Docker và CI/CD.
- Production deployment.
- Logging, monitoring cơ bản.
- Hoàn thiện báo cáo đồ án.
- Chuẩn bị slide và kịch bản bảo vệ.

Đây là lộ trình dự kiến, cần điều chỉnh theo tiến độ thực tế và yêu cầu giảng viên.

---

# VI. PHẠM VI ƯU TIÊN

## Nhóm bắt buộc

- Authentication & Sessions.
- Multi-vendor và RBAC.
- Products và Cart.
- Orders và Inventory.
- Concurrency handling.
- Transactions và consistency.
- Recommendation Research.
- Automated tests quan trọng.
- Deployment.
- Báo cáo tốt nghiệp và thực nghiệm.

## Nhóm bổ sung nếu đủ thời gian

- Payment sandbox nâng cao.
- Background jobs.
- Audit logs.
- Dashboard analytics nâng cao.
- Transactional outbox.
- Realtime notifications.
- Quản lý nhân viên shop chi tiết.

## Chưa làm trong phiên bản 3 tháng

- Microservices phức tạp.
- Kubernetes.
- Kafka.
- ERP đầy đủ.
- AI chatbot.
- Mobile app riêng.
- Logistics phức tạp.
- Demand Forecasting chuyên sâu.
- NLP Sentiment Analysis chuyên sâu.

Nguyên tắc: Ưu tiên chiều sâu, tính đúng đắn và chất lượng hệ thống hơn số lượng tính năng.

---

# VII. BÁO CÁO ĐỒ ÁN TỐT NGHIỆP

Tôi chưa từng viết báo cáo tốt nghiệp trước đây nên cần được hướng dẫn từng bước, bao gồm cấu trúc, cách viết, biểu đồ, trích dẫn và cách tổ chức nội dung.

Chúng tôi đã thống nhất rằng:

**Báo cáo được chia theo chủ đề lớn, không phải mỗi tính năng là một chương riêng.**

Ví dụ:

- Chương 1: Tổng quan đề tài.
- Chương 2: Cơ sở lý thuyết và công nghệ.
- Chương 3: Phân tích và thiết kế hệ thống.
- Chương 4: Xây dựng và triển khai hệ thống.
- Chương 5: Nghiên cứu, kiểm thử và đánh giá.
- Chương 6: Kết luận và hướng phát triển.

Cấu trúc này chỉ là đề xuất, cần điều chỉnh theo mẫu của trường.

### Cấu trúc nội dung

Báo cáo → Chương → Mục → Tiểu mục → Đoạn văn, sơ đồ, bảng biểu, thuật toán và các bằng chứng liên quan.

Ví dụ:

**Chương 4. Xây dựng và triển khai hệ thống**

- 4.1. Authentication & Session.
  - 4.1.1. Đăng ký và đăng nhập.
  - 4.1.2. Session đa thiết bị.
  - 4.1.3. Thu hồi session khi đổi mật khẩu.
- 4.2. Quản lý sản phẩm.
- 4.3. Giỏ hàng và đặt hàng.
- 4.4. Quản lý tồn kho.
- 4.5. Tích hợp hệ thống gợi ý.

Một chương chứa nhiều mục và một mục có thể chứa nhiều tiểu mục. Không tạo một chương mới cho mỗi tính năng.

### Cách viết từng tiểu mục

Tùy loại chương:

**Chương lý thuyết:** Khái niệm, nguyên lý, ví dụ, trích dẫn.

**Chương thiết kế:** Yêu cầu, mô hình dữ liệu, sơ đồ, quy trình và lý do lựa chọn.

**Chương triển khai:** Cách hiện thực giải pháp, những thành phần quan trọng, xử lý lỗi và ngoại lệ.

**Chương thực nghiệm:** Mục tiêu, phương pháp, dữ liệu, môi trường, kết quả, phân tích.

Không cần nhồi toàn bộ source code hoặc quá nhiều ảnh giao diện vào báo cáo.

### Quy trình viết báo cáo

Không đợi code xong toàn bộ mới viết.

Quy trình:

**Phân tích → Thiết kế → Code → Test → Lưu bằng chứng → Cập nhật báo cáo.**

Tài liệu nên chia làm hai loại:

1. **Technical Documentation:** Ghi lại kiến trúc, quyết định kỹ thuật, edge cases, diagrams, test results và các bài lab.
2. **Thesis Report:** Báo cáo học thuật chính thức, được tổng hợp và viết theo từng chương.

Khi hoàn thành một module, cập nhật các mục có liên quan trong báo cáo. Không bắt buộc tính năng nào cũng phải xuất hiện ở mọi chương.

### Việc cần chuẩn bị

- Xin mẫu báo cáo chính thức của khoa.
- Tạo khung báo cáo từ tuần 1.
- Dùng Word Heading Styles để tạo mục lục tự động.
- Lưu nguồn tham khảo ngay từ lúc nghiên cứu.
- Lưu ERD, diagrams, screenshots và kết quả kiểm thử.
- Ghi lại các quyết định kiến trúc và lý do lựa chọn.
- Không ghi kết quả nghiên cứu hoặc kiểm thử khi chưa thực hiện.
- Dành thời gian cập nhật tài liệu hằng tuần.

---

# VIII. PHƯƠNG PHÁP HỌC KHI XÂY DỰNG DỰ ÁN

Mục tiêu không phải chỉ code cho xong.

Với những bài toán kỹ thuật quan trọng, tôi muốn được hướng dẫn theo quy trình:

1. **Requirement:** Xác định yêu cầu.
2. **Business Rules:** Hiểu các quy tắc nghiệp vụ.
3. **Edge Cases:** Xác định các tình huống đặc biệt.
4. **Research:** Tìm hiểu các giải pháp.
5. **Trade-offs:** So sánh ưu điểm, nhược điểm.
6. **Design:** Thiết kế giải pháp phù hợp.
7. **Implementation:** Lập trình.
8. **Testing:** Kiểm chứng tính đúng đắn.
9. **Review:** Đánh giá và cải thiện.
10. **Documentation:** Ghi lại kiến thức, quyết định và bằng chứng.

Ví dụ, với yêu cầu đổi mật khẩu và đăng xuất các thiết bị khác, tôi muốn hiểu tại sao phải quản lý session, các lựa chọn thiết kế khác nhau và cách kiểm thử, chứ không chỉ nhận code.

Với concurrency, tôi muốn tái hiện được lỗi race condition, nghiên cứu những phương pháp giải quyết, tự triển khai và chứng minh bằng kiểm thử.

**Hãy giúp tôi phát triển tư duy Software Engineering, không chỉ cung cấp code hoàn chỉnh.**

---

# IX. NHỮNG VIỆC CHƯA CHỐT VÀ CẦN LÀM TIẾP

Hiện tại đã chốt tên hướng dự án, ba trụ cột và các nhóm chức năng lớn.

Những việc cần tiếp tục:

1. Xác định yêu cầu và quy định đồ án của trường.
2. Xây dựng SRS chi tiết.
3. Chốt MVP và phân biệt chức năng bắt buộc/mở rộng.
4. Xác định business rules và use cases.
5. Chốt backend Express hay NestJS.
6. Thiết kế kiến trúc module.
7. Thiết kế ERD và quan hệ dữ liệu.
8. Xác định lifecycle của Order, Payment và InventoryReservation.
9. Thiết kế phương pháp nghiên cứu Recommendation và nguồn dữ liệu.
10. Xây dựng test strategy.
11. Chia công việc thành các milestone 12 tuần.
12. Tạo khung báo cáo tốt nghiệp theo mẫu của khoa.

Các thành phần trên chưa có thiết kế kỹ thuật cuối cùng, nên không được mặc định đã được quyết định hoặc triển khai.

---

# X. KẾT QUẢ KỲ VỌNG

Sau 3 tháng, tôi muốn có:

- Một hệ thống SmartMarket Full-stack hoạt động được.
- Marketplace có các nghiệp vụ mua bán chính.
- Hệ thống Recommendation có thực nghiệm và đánh giá.
- Các bài lab Engineering đã được triển khai và kiểm thử.
- Source code có kiến trúc rõ ràng.
- Database và API được thiết kế hợp lý.
- Automated tests cho các luồng quan trọng.
- Một phiên bản deploy để demo.
- Technical documentation.
- Báo cáo đồ án tốt nghiệp có đủ phân tích, thiết kế, triển khai, nghiên cứu và kết quả thực nghiệm.
- Slide và demo phục vụ buổi bảo vệ.
- Một project portfolio có chiều sâu để ứng tuyển công việc Full-stack.

## TƯ DUY CỐT LÕI CỦA ĐỒ ÁN

**Commerce là sản phẩm.**

**Research là chiều sâu học thuật.**

**Engineering Labs là môi trường rèn luyện kỹ năng chuyên nghiệp.**

Ba trụ cột phải liên kết với nhau, không xây thành ba project tách biệt.

Ưu tiên một hệ thống có quy mô vừa phải nhưng được thiết kế, kiểm thử và giải thích kỹ lưỡng.

**SmartMarket không chỉ là đồ án để tốt nghiệp, mà còn là dự án giúp tôi rèn luyện cách suy nghĩ và làm việc của một Software Engineer.**

---

## YÊU CẦU CHO CHATGPT Ở PHIÊN TIẾP THEO

Hãy sử dụng toàn bộ thông tin này làm bối cảnh đã thống nhất.

Tôi muốn bạn đóng vai trò người hướng dẫn đồ án tốt nghiệp đồng thời là Senior Full-stack/Software Engineer mentor.

Khi hỗ trợ tôi:

- Luôn gắn kiến thức với yêu cầu thực tế của SmartMarket.
- Giải thích tại sao lựa chọn một giải pháp, không chỉ hướng dẫn cách viết code.
- Chú trọng business rules, edge cases, architecture, security, concurrency, testing và trade-offs.
- Chủ động nhận diện những lỗ hổng trong thiết kế.
- Đề xuất phạm vi vừa sức trong 12 tuần.
- Phân biệt những gì đã chốt, những gì đang đề xuất và những gì đã thực sự triển khai.
- Hướng dẫn cách viết báo cáo tốt nghiệp song song với quá trình phát triển.
- Không tự ý biến dự án thành hệ thống quá lớn hoặc đưa thêm công nghệ không cần thiết.

**Mục tiêu tiếp theo: Hoàn thiện SRS, xác định các module và thiết kế lộ trình triển khai SmartMarket trong 12 tuần.**
