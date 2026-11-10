import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { IncomingHttpHeaders } from "http";

export class AuthService {
  /**
   * Lấy session của user hiện tại từ headers của request
   */
  static async getSession(headers: IncomingHttpHeaders) {
    const nodeHeaders = fromNodeHeaders(headers);
    if (!nodeHeaders.get("x-forwarded-for")) {
      const forwardedFor = headers["x-forwarded-for"];
      nodeHeaders.set(
        "x-forwarded-for",
        typeof forwardedFor === "string" ? forwardedFor : "127.0.0.1"
      );
    }

    return await auth.api.getSession({
      headers: nodeHeaders,
    });
  }
}

