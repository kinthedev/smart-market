import { auth } from "../../lib/auth.js";
import { fromNodeHeaders } from "better-auth/node";
import type { IncomingHttpHeaders } from "http";

export class AuthService {
  /**
   * Lấy session của user hiện tại từ headers của request
   */
  static async getSession(headers: IncomingHttpHeaders) {
    return await auth.api.getSession({
      headers: fromNodeHeaders(headers),
    });
  }
}

