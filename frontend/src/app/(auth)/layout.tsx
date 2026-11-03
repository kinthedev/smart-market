export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-gradient-to-br from-orange-50/50 via-slate-50/60 to-orange-100/40 p-4 sm:p-6 md:p-10 dark:from-background dark:via-background dark:to-orange-950/15">
      <div className="w-full max-w-sm md:max-w-4xl">
        {children}
      </div>
    </div>
  )
}

