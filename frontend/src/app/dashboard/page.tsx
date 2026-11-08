'use client'

import { useAuth } from '@/src/features/auth/hooks/use-auth'
import { AdminDashboard } from '@/src/features/dashboard/components/admin-dashboard'
import Link from 'next/link'
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react'

// Danh sách email có quyền quản trị viên cao nhất
const ADMIN_EMAILS = [
    'admin@smartmarket.com',
]

export default function Page() {
    const { user, isLoading } = useAuth()

    // 1. Trạng thái đang tải session
    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc]">
                <div className="flex flex-col items-center gap-3">
                    <div className="size-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
                    <p className="text-sm font-medium text-slate-500">Đang kiểm tra quyền truy cập hệ thống...</p>
                </div>
            </div>
        )
    }

    // 2. Chưa đăng nhập
    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] p-4">
                <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-lg">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <ShieldAlert className="size-8" />
                    </div>
                    <h1 className="mt-4 text-xl font-bold text-slate-900">401 · Yêu Cầu Đăng Nhập</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Trang quản trị này chỉ dành cho tài khoản Quản trị viên (Admin). Bạn cần đăng nhập tài khoản có thẩm quyền để tiếp tục.
                    </p>
                    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                        <Link
                            href="/login"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-orange-500 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-600"
                        >
                            <LogIn className="size-4" /> Đăng nhập Admin
                        </Link>
                        <Link
                            href="/"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <ArrowLeft className="size-4" /> Về trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // 3. Đã đăng nhập nhưng không phải admin
    const isAdmin = Boolean(user.email && ADMIN_EMAILS.includes(user.email.toLowerCase()))

    if (!isAdmin) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] p-4">
                <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-lg">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <ShieldAlert className="size-8" />
                    </div>
                    <span className="mt-3 inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700 ring-1 ring-red-200">
                        403 Truy cập bị từ chối
                    </span>
                    <h1 className="mt-3 text-xl font-bold text-slate-900">Không Có Quyền Truy Cập</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Tài khoản <strong>{user.email}</strong> là tài khoản khách hàng thông thường và không có quyền truy cập vào bảng điều khiển quản trị SmartMarket.
                    </p>
                    <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
                        <Link
                            href="/"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-orange-500 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-orange-600"
                        >
                            <ArrowLeft className="size-4" /> Về trang mua sắm
                        </Link>
                        <Link
                            href="/account"
                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-300 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Tài khoản của tôi
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // 4. Đúng tài khoản Admin
    return <AdminDashboard />
}
