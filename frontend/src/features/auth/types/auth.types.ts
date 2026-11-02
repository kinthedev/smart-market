export interface AuthUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthSession {
  id: string;
  userId: string;
  expiresAt: Date;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthActionResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

