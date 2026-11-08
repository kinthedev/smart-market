import { AccountManagementView } from "@/src/features/account"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Thông tin tài khoản | SmartMarket",
  description: "Quản lý thông tin cá nhân, địa chỉ nhận hàng và bảo mật tài khoản khách hàng trên SmartMarket",
}

export default function AccountPage() {
  return <AccountManagementView />
}
