import { JwtPayload } from 'jsonwebtoken';

export interface MyJwtPayload extends JwtPayload {
  userId: string;
}

export interface LoginedUser {
  id: string;
}

export interface AuthInfo {
  userId: string;
}

export interface LoginResult {
  registeredUser: boolean;
  tempToken?: string;
  accessToken?: string;
}
