import { authClient } from "@/src/lib/auth-client";
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
  private static frontendURL(path: string): string {
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }

    return new URL(path, window.location.origin).toString();
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
          error: response.error.message || `Đăng nhập bằng ${provider} thất bại.`,
        };
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Không thể kết nối đến máy chủ xác thực.",
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
          error:
            response.error.message ||
            "Email hoặc mật khẩu không chính xác. Vui lòng thử lại.",
        };
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Đã xảy ra lỗi kết nối đến máy chủ xác thực.",
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
          error:
            response.error.message ||
            "Đăng ký không thành công. Vui lòng thử lại.",
        };
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || "Đã xảy ra lỗi kết nối đến máy chủ xác thực.",
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
        error: err?.message || "Đăng xuất thất bại.",
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
