"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../api/auth.service";
import type { LoginCredentials, SignupCredentials } from "../types/auth.types";

/**
 * useAuth Hook: Cung cấp trạng thái xác thực và các hành động (login, signup, logout)
 * cho bất kỳ component nào trong ứng dụng mà không cần biết Better Auth là gì.
 */
export function useAuth() {
  const router = useRouter();
  const sessionInfo = AuthService.useSession();

  const login = useCallback(
    async (credentials: LoginCredentials, callbackURL: string = "/") => {
      const result = await AuthService.login(credentials, callbackURL);
      if (result.success) {
        router.push(callbackURL);
        router.refresh();
      }
      return result;
    },
    [router]
  );

  const signup = useCallback(
    async (credentials: SignupCredentials, callbackURL: string = "/") => {
      const result = await AuthService.signup(credentials, callbackURL);
      if (result.success) {
        router.push(callbackURL);
        router.refresh();
      }
      return result;
    },
    [router]
  );

  const logout = useCallback(async () => {
    const result = await AuthService.logout();
    if (result.success) {
      router.push("/login");
      router.refresh();
    }
    return result;
  }, [router]);

  return {
    ...sessionInfo,
    login,
    signup,
    logout,
  };
}

