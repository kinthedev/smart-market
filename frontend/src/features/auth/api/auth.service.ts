import { authClient } from "@/src/lib/auth-client";
import { env } from "@/src/lib/env";
import type {
  LoginCredentials,
  SignupCredentials,
  AuthActionResult,
  AuthUser,
  AuthSession,
} from "../types/auth.types";

/**
 * AuthService: Lớp trung gian trừu tượng hóa toàn bộ thao tác Authentication.
 * Các React Components hoặc Hooks sẽ chỉ gọi qua Service này,
 * không phụ thuộc trực tiếp vào thư viện Better Auth bên dưới.
 */
export class AuthService {
  private static formatErrorMessage(error: any, defaultMsg: string): string {
    const rawMessage = error?.message || error || "";
    if (typeof rawMessage === "string") {
      const lower = rawMessage.toLowerCase();
      if (lower.includes("invalid password") || lower.includes("invalid email or password") || lower.includes("invalid credentials")) {
        return "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.";
      }
      if (lower.includes("user already exists") || lower.includes("email already in use")) {
        return "Email này đã được sử dụng. Vui lòng chọn email khác hoặc đăng nhập.";
      }
      if (lower.includes("user not found")) {
        return "Tài khoản không tồn tại trên hệ thống.";
      }
      if (lower.includes("failed to fetch") || lower.includes("network error") || lower.includes("connect")) {
        return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.";
      }
      if (lower.includes("rate limit") || lower.includes("too many requests")) {
        return "Bạn đã thao tác quá nhiều lần. Vui lòng thử lại sau vài phút.";
      }
      if (lower.includes("password is too short")) {
        return "Mật khẩu quá ngắn, vui lòng nhập tối thiểu 8 ký tự.";
      }
    }
    return defaultMsg;
  }

  private static frontendURL(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    // Ưu tiên URL frontend trong .env (NEXT_PUBLIC_FRONTEND_URL).
    // env.FRONTEND_URL đã tự fallback về origin trình duyệt ở production,
    // chỉ dùng localhost khi thực sự chạy ở môi trường dev/SSR.
    const baseURL =
      env.FRONTEND_URL ||
      (typeof window !== "undefined"
        ? window.location.origin
        : "http://localhost:3000");

    return new URL(path, baseURL).toString();
  }

  /**
   * Đăng nhập bằng Google hoặc Facebook.
   * Better Auth sẽ chuyển trình duyệt sang trang OAuth của provider.
   */
  static async socialLogin(
    provider: "google" | "facebook",
    callbackURL: string = "/",
    errorCallbackURL: string = "/login",
  ): Promise<AuthActionResult> {
    try {
      const response = await authClient.signIn.social({
        provider,
        callbackURL: AuthService.frontendURL(callbackURL),
        errorCallbackURL: AuthService.frontendURL(errorCallbackURL),
      });

      if (response.error) {
        return {
          success: false,
          error: AuthService.formatErrorMessage(
            response.error,
            `Đăng nhập bằng ${provider} thất bại. Vui lòng thử lại.`
          ),
        };
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: AuthService.formatErrorMessage(
          err,
          "Không thể kết nối đến máy chủ xác thực. Vui lòng thử lại."
        ),
      };
    }
  }

  /**
   * Đăng nhập bằng Email & Mật khẩu
   */
  static async login(
    credentials: LoginCredentials,
    callbackURL: string = "/"
  ): Promise<AuthActionResult> {
    try {
      const response = await authClient.signIn.email({
        email: credentials.email,
        password: credentials.password,
        callbackURL,
      });

      if (response.error) {
        return {
          success: false,
          error: AuthService.formatErrorMessage(
            response.error,
            "Email hoặc mật khẩu không chính xác. Vui lòng thử lại."
          ),
        };
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: AuthService.formatErrorMessage(
          err,
          "Đã xảy ra lỗi kết nối đến máy chủ xác thực. Vui lòng thử lại."
        ),
      };
    }
  }

  /**
   * Đăng ký tài khoản mới bằng Email & Mật khẩu
   */
  static async signup(
    credentials: SignupCredentials,
    callbackURL: string = "/"
  ): Promise<AuthActionResult> {
    try {
      const response = await authClient.signUp.email({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
        callbackURL,
      });

      if (response.error) {
        return {
          success: false,
          error: AuthService.formatErrorMessage(
            response.error,
            "Đăng ký không thành công. Vui lòng thử lại."
          ),
        };
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: AuthService.formatErrorMessage(
          err,
          "Đã xảy ra lỗi kết nối đến máy chủ xác thực. Vui lòng thử lại."
        ),
      };
    }
  }

  /**
   * Đăng xuất khỏi hệ thống
   */
  static async logout(): Promise<AuthActionResult> {
    try {
      await authClient.signOut({});
      return { success: true };
    } catch (err: any) {
      return {
        success: false,
        error: AuthService.formatErrorMessage(err, "Đăng xuất thất bại."),
      };
    }
  }

  /**
   * React hook theo dõi trạng thái session
   */
  static useSession(): {
    user: AuthUser | null;
    session: AuthSession | null;
    isLoading: boolean;
    isAuthenticated: boolean;
  } {
    const { data, isPending } = authClient.useSession();
    const sessionData = data as {
      user?: AuthUser;
      session?: AuthSession;
    } | null;

    const user = sessionData?.user || null;
    const session = sessionData?.session || null;

    return {
      user,
      session,
      isLoading: isPending,
      isAuthenticated: Boolean(user),
    };
  }
}
