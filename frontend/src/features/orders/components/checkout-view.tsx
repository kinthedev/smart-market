"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  QrCode,
  ShoppingBag,
  ChevronRight,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react"
import { useAuth } from "@/src/features/auth/hooks/use-auth"
import { useCart } from "@/src/features/cart/hooks/use-cart"
import { OrderApiService } from "../api/order.service"
import { OrderSuccessView } from "./order-success-view"
import type { Order, PaymentMethod } from "../types/order.types"
import { vietnamLocations } from "@/src/features/account/data/locations"
import { AccountApiService } from "@/src/features/account/api/account.service"
import type { ReceiverAddress } from "@/src/features/account/types/account.types"
import { formatPrice } from "@/src/data-seed/shop-data"

export function CheckoutView() {
  const router = useRouter()
  const { user: authUser, isLoading: isAuthLoading } = useAuth()
  const { items: cartItems, subtotal, clear, removeItem } = useCart()

  // State thông tin giao hàng
  const [receiverName, setReceiverName] = React.useState("")
  const [receiverPhone, setReceiverPhone] = React.useState("")
  const [selectedProvinceId, setSelectedProvinceId] = React.useState("")
  const [selectedDistrictId, setSelectedDistrictId] = React.useState("")
  const [selectedWard, setSelectedWard] = React.useState("")
  const [specificAddress, setSpecificAddress] = React.useState("")
  const [note, setNote] = React.useState("")

  // Sổ thông tin người nhận đã lưu
  const [savedAddresses, setSavedAddresses] = React.useState<ReceiverAddress[]>([])
  const [selectedAddressId, setSelectedAddressId] = React.useState("")

  // Phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>("COD")

  // Trạng thái xử lý
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState("")
  const [completedOrder, setCompletedOrder] = React.useState<Order | null>(null)

  // Điền thông tin người dùng nếu đã đăng nhập
  React.useEffect(() => {
    if (authUser) {
      if (authUser.name && !receiverName) setReceiverName(authUser.name)
    }
  }, [authUser, receiverName])

  // Tải sổ thông tin người nhận đã lưu trong database
  React.useEffect(() => {
    if (!authUser) {
      setSavedAddresses([])
      setSelectedAddressId("")
      return
    }

    let mounted = true
    AccountApiService.getAddresses()
      .then((data) => {
        if (mounted) setSavedAddresses(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (mounted) setSavedAddresses([])
      })

    return () => {
      mounted = false
    }
  }, [authUser])

  const applyAddress = React.useCallback((address: ReceiverAddress) => {
    setReceiverName(address.receiverName)
    setReceiverPhone(address.receiverPhone)
    setSelectedProvinceId(address.provinceId)
    setSelectedDistrictId(address.districtId)
    setSelectedWard(address.ward)
    setSpecificAddress(address.addressDetail)
    setSelectedAddressId(address.id)
  }, [])

  // Tự chọn địa chỉ mặc định (hoặc địa chỉ đầu tiên) khi vừa tải xong.
  React.useEffect(() => {
    if (selectedAddressId || savedAddresses.length === 0) return
    const preferred =
      savedAddresses.find((address) => address.isDefault) ?? savedAddresses[0]
    if (preferred) applyAddress(preferred)
  }, [savedAddresses, selectedAddressId, applyAddress])

  // Lấy danh sách quận/huyện dựa theo tỉnh thành đã chọn
  const currentProvince = React.useMemo(() => {
    return vietnamLocations.find((p) => p.id === selectedProvinceId)
  }, [selectedProvinceId])

  const currentDistrict = React.useMemo(() => {
    return currentProvince?.districts.find((d) => d.id === selectedDistrictId)
  }, [currentProvince, selectedDistrictId])

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProvinceId(e.target.value)
    setSelectedDistrictId("")
    setSelectedWard("")
  }

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrictId(e.target.value)
    setSelectedWard("")
  }

  // Xử lý gửi đơn hàng
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    if (!isAuthLoading && !authUser) {
      router.push("/login?callbackUrl=/checkout")
      return
    }

    if (cartItems.length === 0) {
      setErrorMessage("Giỏ hàng của bạn đang trống. Vui lòng chọn sản phẩm trước khi thanh toán.")
      return
    }

    if (!receiverName.trim()) {
      setErrorMessage("Vui lòng nhập họ và tên người nhận hàng.")
      return
    }

    const cleanPhone = receiverPhone.trim()
    if (!cleanPhone || cleanPhone.length < 9 || cleanPhone.length > 15) {
      setErrorMessage("Vui lòng nhập số điện thoại hợp lệ (từ 9 đến 15 chữ số).")
      return
    }

    if (!selectedProvinceId || !selectedDistrictId || !selectedWard) {
      setErrorMessage("Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã.")
      return
    }

    if (!specificAddress.trim()) {
      setErrorMessage("Vui lòng nhập số nhà, tên đường hoặc địa chỉ cụ thể.")
      return
    }

    const fullAddress = [
      specificAddress.trim(),
      selectedWard,
      currentDistrict?.name,
      currentProvince?.name,
    ]
      .filter(Boolean)
      .join(", ")

    setIsSubmitting(true)

    try {
      const order = await OrderApiService.createOrder({
        receiverName: receiverName.trim(),
        receiverPhone: cleanPhone,
        address: fullAddress,
        note: note.trim() || null,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          size: item.size || null,
          color: item.color || null,
        })),
      })

      // Xóa toàn bộ sản phẩm trong giỏ hàng sau khi đặt thành công
      clear()
      setCompletedOrder(order)
      window.scrollTo({ top: 0, behavior: "smooth" })
    } catch (err: any) {
      setErrorMessage(err.message || "Đặt hàng thất bại. Vui lòng kiểm tra lại thông tin.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Nếu đơn hàng đã hoàn thành, hiển thị view thành công
  if (completedOrder) {
    return <OrderSuccessView order={completedOrder} paymentMethod={paymentMethod} />
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <ChevronRight size={13} />
        <Link href="/cart" className="hover:text-primary">
          Giỏ hàng
        </Link>
        <ChevronRight size={13} />
        <span className="font-semibold text-slate-800">Thanh toán</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900 md:text-2xl">
          Thanh toán đơn hàng
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Vui lòng kiểm tra thông tin giao hàng và chọn phương thức thanh toán phù hợp.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <ShoppingBag size={28} />
          </div>
          <h2 className="mt-4 text-base font-bold text-slate-800">
            Không có sản phẩm nào để thanh toán
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Giỏ hàng của bạn đang trống. Hãy thêm sản phẩm trước khi tiến hành thanh toán.
          </p>
          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#ee4d2d] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#d43f21]"
            >
              <ArrowLeft size={14} /> Khám phá sản phẩm
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmitOrder}>
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Cột trái: Thông tin nhận hàng & Thanh toán */}
            <div className="space-y-6">
              {/* Khối 1: Thông tin người nhận */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#5b5bd6] text-xs text-white">
                    1
                  </span>
                  Thông tin người nhận hàng
                </h2>

                {savedAddresses.length > 0 && (
                  <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-700">
                        Chọn từ thông tin người nhận đã lưu
                      </p>
                      <span className="text-[11px] text-slate-500">
                        {savedAddresses.length} địa chỉ
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {savedAddresses.map((address) => {
                        const selected = selectedAddressId === address.id
                        const fullAddress = [
                          address.addressDetail,
                          address.ward,
                          address.district,
                          address.province,
                        ]
                          .filter(Boolean)
                          .join(", ")

                        return (
                          <button
                            key={address.id}
                            type="button"
                            onClick={() => applyAddress(address)}
                            className={`rounded-md border p-3 text-left transition ${
                              selected
                                ? "border-[#ee4d2d] bg-white ring-1 ring-[#ee4d2d]"
                                : "border-slate-200 bg-white hover:border-orange-300"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <strong className="truncate text-xs font-bold text-slate-800">
                                {address.receiverName}
                              </strong>
                              {address.isDefault && (
                                <span className="shrink-0 rounded-full bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="mt-0.5 text-[11px] text-slate-500">
                              {address.receiverPhone}
                            </p>
                            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                              {fullAddress}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Họ và tên người nhận <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="Ví dụ: Nguyễn Văn A"
                      className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#5b5bd6] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Số điện thoại nhận hàng <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={receiverPhone}
                      onChange={(e) => setReceiverPhone(e.target.value)}
                      placeholder="Ví dụ: 0987654321"
                      className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#5b5bd6] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Địa chỉ phân cấp: Tỉnh / Quận / Phường */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Tỉnh / Thành phố <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={selectedProvinceId}
                      onChange={handleProvinceChange}
                      className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#5b5bd6] focus:outline-hidden"
                    >
                      <option value="">-- Chọn Tỉnh / Thành --</option>
                      {vietnamLocations.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Quận / Huyện <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      disabled={!selectedProvinceId}
                      value={selectedDistrictId}
                      onChange={handleDistrictChange}
                      className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#5b5bd6] focus:outline-hidden disabled:bg-slate-50"
                    >
                      <option value="">-- Chọn Quận / Huyện --</option>
                      {currentProvince?.districts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Phường / Xã <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      disabled={!selectedDistrictId}
                      value={selectedWard}
                      onChange={(e) => setSelectedWard(e.target.value)}
                      className="mt-1.5 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 focus:border-[#5b5bd6] focus:outline-hidden disabled:bg-slate-50"
                    >
                      <option value="">-- Chọn Phường / Xã --</option>
                      {currentDistrict?.wards.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-700">
                    Địa chỉ cụ thể (Số nhà, tên đường, ngõ ngách) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={specificAddress}
                    onChange={(e) => setSpecificAddress(e.target.value)}
                    placeholder="Ví dụ: Số 25, ngõ 123 đường Cầu Giấy"
                    className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#5b5bd6] focus:outline-hidden"
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-semibold text-slate-700">
                    Ghi chú đơn hàng (Tùy chọn)
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi giao"
                    className="mt-1.5 w-full rounded-md border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-[#5b5bd6] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Khối 2: Phương thức vận chuyển */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#5b5bd6] text-xs text-white">
                    2
                  </span>
                  Phương thức vận chuyển
                </h2>

                <div className="mt-4 flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50/50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Giao hàng tiêu chuẩn toàn quốc
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Thời gian giao dự kiến từ 2 - 4 ngày làm việc
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 uppercase">
                    Miễn phí
                  </span>
                </div>
              </div>

              {/* Khối 3: Phương thức thanh toán */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs">
                <h2 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                  <span className="flex size-6 items-center justify-center rounded-full bg-[#5b5bd6] text-xs text-white">
                    3
                  </span>
                  Phương thức thanh toán
                </h2>

                <div className="mt-4 space-y-3">
                  {/* COD */}
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition ${
                      paymentMethod === "COD"
                        ? "border-[#5b5bd6] bg-indigo-50/40 ring-1 ring-[#5b5bd6]"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={() => setPaymentMethod("COD")}
                        className="size-4 text-[#5b5bd6]"
                      />
                      <div className="flex items-center gap-2.5">
                        <Banknote size={20} className="text-emerald-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Thanh toán khi nhận hàng (COD)
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Nhận hàng, kiểm tra sản phẩm trước khi thanh toán tiền mặt
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Chuyển khoản VietQR */}
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition ${
                      paymentMethod === "BANK_TRANSFER"
                        ? "border-[#5b5bd6] bg-indigo-50/40 ring-1 ring-[#5b5bd6]"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="BANK_TRANSFER"
                        checked={paymentMethod === "BANK_TRANSFER"}
                        onChange={() => setPaymentMethod("BANK_TRANSFER")}
                        className="size-4 text-[#5b5bd6]"
                      />
                      <div className="flex items-center gap-2.5">
                        <QrCode size={20} className="text-blue-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Chuyển khoản ngân hàng 24/7 (VietQR)
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Quét mã QR tiện lợi qua mọi ứng dụng ngân hàng di động
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>

                  {/* Ví MoMo */}
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-lg border p-3.5 transition ${
                      paymentMethod === "MOMO"
                        ? "border-[#5b5bd6] bg-indigo-50/40 ring-1 ring-[#5b5bd6]"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        value="MOMO"
                        checked={paymentMethod === "MOMO"}
                        onChange={() => setPaymentMethod("MOMO")}
                        className="size-4 text-[#5b5bd6]"
                      />
                      <div className="flex items-center gap-2.5">
                        <CreditCard size={20} className="text-pink-600" />
                        <div>
                          <p className="text-xs font-bold text-slate-800">
                            Ví điện tử MoMo
                          </p>
                          <p className="text-[11px] text-slate-500">
                            Thanh toán an toàn, tích điểm qua ứng dụng MoMo
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Cột phải: Tóm tắt đơn hàng & Nút Xác nhận */}
            <div>
              <div className="rounded-xl border border-slate-200/90 bg-white p-5 shadow-xs lg:sticky lg:top-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800">
                    Đơn hàng ({cartItems.length} sản phẩm)
                  </h3>
                  <Link
                    href="/cart"
                    className="text-xs font-medium text-[#5b5bd6] hover:underline"
                  >
                    Sửa giỏ hàng
                  </Link>
                </div>

                {/* Danh sách món hàng thu gọn */}
                <div className="mt-3 max-h-64 divide-y divide-slate-100 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div key={item.key} className="flex items-center gap-3 py-2.5 text-xs">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-slate-200 bg-white">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-slate-300">
                            <ShoppingBag size={16} />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-slate-800 truncate" title={item.name}>
                          {item.name}
                        </h4>
                        {(item.size || item.color) && (
                          <p className="text-[11px] text-slate-400">
                            {[item.size, item.color].filter(Boolean).join(" / ")}
                          </p>
                        )}
                        <span className="text-slate-500">
                          SL: {item.quantity} × {formatPrice(item.price)}đ
                        </span>
                      </div>
                      <strong className="text-slate-800">
                        {formatPrice(item.price * item.quantity)}đ
                      </strong>
                    </div>
                  ))}
                </div>

                {/* Chi tiết tính tiền */}
                <div className="mt-4 border-t border-slate-100 pt-3 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <strong className="text-slate-800">{formatPrice(subtotal)}đ</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí giao hàng:</span>
                    <span className="font-semibold text-emerald-600">Miễn phí</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 text-sm">
                    <span className="font-bold text-slate-800">Tổng thanh toán:</span>
                    <strong className="text-base font-extrabold text-[#ee4d2d]">
                      {formatPrice(subtotal)}đ
                    </strong>
                  </div>
                </div>

                {errorMessage && (
                  <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#ee4d2d] text-xs font-bold uppercase tracking-wider text-white shadow-sm transition hover:bg-[#d43f21] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Đang xử lý đặt hàng...
                    </>
                  ) : (
                    "Xác nhận đặt hàng"
                  )}
                </button>

                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Bảo mật thông tin giao dịch 100%
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
