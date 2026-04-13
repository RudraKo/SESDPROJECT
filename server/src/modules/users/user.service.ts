import { AppError, assert } from "../../utils/errors";
import { UserRepository } from "./user.repository";

export class UserService {
  private repo = new UserRepository();

  async getProfile(userId: string) {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw new AppError("User not found", 404);
    }

    const [followers, following] = await Promise.all([
      this.repo.countFollowers(userId),
      this.repo.countFollowing(userId)
    ]);

    return { ...user, followers, following };
  }

  async follow(followerId: string, followingId: string) {
    assert(followerId !== followingId, "Cannot follow yourself", 400);

    const existing = await this.repo.isFollowing(followerId, followingId);
    if (existing) {
      return { status: "already_following" };
    }

    await this.repo.follow(followerId, followingId);
    return { status: "followed" };
  }

  async unfollow(followerId: string, followingId: string) {
    assert(followerId !== followingId, "Cannot unfollow yourself", 400);

    const existing = await this.repo.isFollowing(followerId, followingId);
    if (!existing) {
      return { status: "not_following" };
    }

    await this.repo.unfollow(followerId, followingId);
    return { status: "unfollowed" };
  }

  async getFollowedIds(userId: string) {
    const rows = await this.repo.getFollowedIds(userId);
    return rows.map((row) => row.followingId);
  }
}
