"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "cn";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/src/components/ui/field";
import { Input } from "@/src/components/ui/input";
import { useAuth } from "../hooks/use-auth";
import { loginSchema } from "../schemas/auth.schema";
import { AuthIllustration } from "./auth-illustration";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login, socialLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");
    const errorDescription = params.get("error_description");

    if (error === "account_not_linked") {
      setServerError(
        "Email này đã được đăng ký bằng mật khẩu. Vui lòng đăng nhập bằng email và mật khẩu trước.",
      );
    } else if (errorDescription) {
      setServerError(errorDescription);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setServerError(null);

    // 1. Validate bằng Zod
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      for (const issue of validation.error.issues) {
        const fieldName = issue.path[0] as string;
        if (!errors[fieldName]) {
          errors[fieldName] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setIsLoading(true);

    // 2. Gọi qua useAuth abstraction layer
    const result = await login({
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      setServerError(result.error || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google" | "facebook") => {
    setServerError(null);
    setIsLoading(true);

    const result = await socialLogin(provider, "/", "/login");

    // Khi OAuth thành công, Better Auth tự chuyển hướng sang provider.
    // Nhánh này chủ yếu xử lý lỗi cấu hình/CORS/provider để người dùng thấy được.
    if (!result.success) {
      setServerError(result.error || `Đăng nhập bằng ${provider} thất bại.`);
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-4", className)} {...props}>
      <Card className="overflow-hidden rounded-md border border-slate-200 bg-card p-0 shadow-lg shadow-black/5 dark:border-border">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Cột trái: Form Đăng nhập phong cách Shopee */}
          <form className="flex flex-col justify-between p-6 sm:p-8 md:p-10" onSubmit={handleSubmit}>
            <FieldGroup className="gap-4">
              <div className="flex items-center justify-between pb-2">
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl dark:text-slate-100">
                  Đăng nhập
                </h1>
               
              </div>

              {serverError && (
                <div className="rounded-sm border border-destructive/30 bg-destructive/10 p-2.5 text-xs font-medium text-destructive">
                  {serverError}
                </div>
              )}

              {/* Email / Tên đăng nhập */}
              <Field>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email/Số điện thoại/Tên đăng nhập"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="h-10 rounded-sm border-slate-300 placeholder:text-slate-400 focus-visible:border-orange-500 focus-visible:ring-1 focus-visible:ring-orange-500"
                  required
                />
                {fieldErrors.email && (
                  <p className="text-xs font-medium text-destructive">{fieldErrors.email}</p>
                )}
              </Field>

              {/* Mật khẩu kèm Toggle ẩn/hiện */}
              <Field>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="h-10 pr-10 rounded-sm border-slate-300 placeholder:text-slate-400 focus-visible:border-orange-500 focus-visible:ring-1 focus-visible:ring-orange-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs font-medium text-destructive">{fieldErrors.password}</p>
                )}
              </Field>

              {/* Nút Đăng nhập Shopee Style */}
              <Field className="pt-1">
                <Button
                  type="submit"
                  size="lg"
                  className="h-10 w-full rounded-sm text-sm font-bold tracking-wider uppercase bg-orange-500 hover:bg-orange-600 active:bg-orange-700 shadow-none"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
                </Button>
              </Field>

              {/* Duy trì đăng nhập & Quên mật khẩu */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 select-none hover:text-slate-800">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-3.5  rounded-xs border-slate-300 text-orange-500 accent-orange-500 focus:ring-0"
                  />
                  <span>Duy trì đăng nhập</span>
                </label>
                <a
                  href="#"
                  className="text-xs font-medium text-orange-600 underline-offset-2 hover:text-orange-700 hover:underline"
                >
                  Quên mật khẩu?
                </a>
              </div>

              <FieldSeparator className="text-xs text-slate-400 *:data-[slot=field-separator-content]:bg-card *:data-[slot=field-separator-content]:px-3">
                HOẶC
              </FieldSeparator>

              {/* 2 Nút Đăng nhập Mạng xã hội: Facebook & Google chuẩn Shopee */}
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialLogin("facebook")}
                  disabled={isLoading}
                  aria-label="Đăng nhập bằng Facebook"
                  className="h-10 rounded-sm border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-normal"
                >
                  <svg className="size-4" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
                  </svg>
                  <span className="text-xs sm:text-sm">Facebook</span>
                </Button>

                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  disabled={isLoading}
                  aria-label="Đăng nhập bằng Google"
                  className="h-10 rounded-sm border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 font-normal"
                >
                  <svg className="size-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <span className="text-xs sm:text-sm">Google</span>
                </Button>
              </div>

              {/* Chuyển sang Đăng ký */}
              <div className="pt-2 text-center text-xs text-slate-500">
                Bạn mới biết đến Smart Market?{" "}
                <Link
                  href="/signup"
                  className="font-medium text-orange-500 hover:text-orange-600 hover:underline"
                >
                  Đăng ký
                </Link>
              </div>
            </FieldGroup>
          </form>

          {/* Cột phải: Minh họa tông Cam ấm đồng bộ viền */}
          <AuthIllustration
            title="Sắm Thông Minh, Đón Đầu Xu Hướng"
            subtitle="Đăng nhập để khám phá gợi ý sản phẩm cá nhân hoá với AI và nhận ưu đãi độc quyền hôm nay."
            badge="HỆ SINH THÁI SMART MARKET"
          />
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center text-xs text-slate-400">
        Bằng việc đăng nhập, bạn đồng ý với{" "}
        <a href="#" className="text-orange-600 underline underline-offset-2 hover:text-orange-700">
          Điều khoản dịch vụ
        </a>{" "}
        &{" "}
        <a href="#" className="text-orange-600 underline underline-offset-2 hover:text-orange-700">
          Chính sách bảo mật
        </a>{" "}
        của Smart Market.
      </FieldDescription>
    </div>
  );
}
