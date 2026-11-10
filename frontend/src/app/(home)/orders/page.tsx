import type { Metadata } from "next"
import { MyOrdersView } from "@/src/features/orders/components/my-orders-view"

export const metadata: Metadata = {
  title: "Đơn mua của tôi | SmartMarket",
  description:
    "Xem và theo dõi trạng thái các đơn hàng đã đặt tại SmartMarket, hỗ trợ hiển thị tốt trên điện thoại.",
}

export default function OrdersPage() {
  return <MyOrdersView />
}
