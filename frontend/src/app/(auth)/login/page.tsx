import { LoginForm } from "@/src/features/auth";

export const metadata = {
  title: "Đăng nhập | Smart Market",
  description: "Đăng nhập vào tài khoản Smart Market của bạn",
};

export default function LoginPage() {
  return <LoginForm />;
}
