// @file: packages/types/src/responses.ts
import { UserRole } from "./user"
export interface APIMessageResponse { message: string }

export interface SessionResponse {
  id: string;
  email: string;
  role: UserRole;
  exp: number; // expiry timestamp (z tokena)
  iat: number; // issued at
}