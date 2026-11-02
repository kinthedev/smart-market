import { z } from "zod";

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Họ và tên phải có ít nhất 2 ký tự")
    .max(50, "Họ và tên tối đa 50 ký tự"),
  email: z
    .string()
    .email("Email không đúng định dạng"),
  password: z
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
    .max(64, "Mật khẩu tối đa 64 ký tự"),
});

export const loginSchema = z.object({
  email: z
    .string()
    .email("Email không đúng định dạng"),
  password: z
    .string()
    .min(1, "Vui lòng nhập mật khẩu"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

