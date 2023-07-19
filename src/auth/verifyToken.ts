import jwt, { JwtPayload } from "jsonwebtoken";
import { getEnv } from "../utils";

export interface DecodedToken extends JwtPayload {
  user_id: string;
  username: string;
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, getEnv("JWT_SECRET"));

    return decoded as DecodedToken;
  } catch (err) {
    return null;
  }
}
