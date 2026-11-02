"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent } from "@/src/components/ui/card"
import { authClient } from "@/src/lib/auth-client"

export default function Home() {
  const router = useRouter()
  const { data, isPending } = authClient.useSession()
  const session = data as { user?: { name?: string; email?: string } } | null

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh()
        },
      },
    })
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted/40 p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardContent className="flex flex-col items-center gap-6 p-8 text-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight">
                Smart Market 🛒
              </h1>
              <p className="text-sm text-muted-foreground">
                Hệ thống thương mại điện tử thông minh
              </p>
            </div>

            {isPending ? (
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-xs text-muted-foreground">Đang kiểm tra phiên đăng nhập...</p>
              </div>
            ) : session?.user ? (
              <div className="flex w-full flex-col items-center gap-4 py-2">
                <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary">
                  {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-semibold">{session.user.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {session.user.email}
                  </span>
                </div>

                <div className="mt-2 w-full">
                  <Button
                    variant="outline"
                    className="w-full text-destructive hover:bg-destructive/10"
                    onClick={handleSignOut}
                  >
                    Đăng xuất
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex w-full flex-col gap-3 py-2">
                <p className="text-sm text-muted-foreground">
                  Bạn chưa đăng nhập. Vui lòng đăng nhập hoặc tạo tài khoản mới.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Link href="/login" className="w-full">
                    <Button className="w-full">Đăng nhập</Button>
                  </Link>
                  <Link href="/signup" className="w-full">
                    <Button variant="outline" className="w-full">Đăng ký</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}