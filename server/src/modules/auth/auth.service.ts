import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma";
import { env } from "../../config/env";
import { AppError, assert } from "../../utils/errors";

export class AuthService {
  async register(payload: { username: string; email: string; password: string; profilePicUrl?: string }) {
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: payload.email }, { username: payload.username }]
      }
    });

    assert(!existing, "Email or username already in use", 409);

    const passwordHash = await bcrypt.hash(payload.password, 10);

    const user = await prisma.user.create({
      data: {
        username: payload.username,
        email: payload.email,
        passwordHash,
        profilePicUrl: payload.profilePicUrl
      },
      select: {
        id: true,
        username: true,
        email: true,
        profilePicUrl: true
      }
    });

    const token = this.createToken(user);

    return { user, token };
  }

  async login(payload: { email: string; password: string }) {
    const user = await prisma.user.findUnique({
      where: { email: payload.email }
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const match = await bcrypt.compare(payload.password, user.passwordHash);
    if (!match) {
      throw new AppError("Invalid email or password", 401);
    }

    const token = this.createToken({ id: user.id, email: user.email, username: user.username });

    return {
      user: { id: user.id, username: user.username, email: user.email, profilePicUrl: user.profilePicUrl },
      token
    };
  }

  private createToken(user: { id: string; email: string; username: string }) {
    return jwt.sign(user, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
  }
}
