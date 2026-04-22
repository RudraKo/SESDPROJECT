import dotenv from "dotenv";
import type { SignOptions } from "jsonwebtoken";

dotenv.config();

const required = ["JWT_SECRET", "DATABASE_URL"] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: (process.env.JWT_EXPIRES_IN ?? "1h") as SignOptions["expiresIn"],
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173"
};
