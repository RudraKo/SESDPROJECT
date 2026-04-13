import { prisma } from "../../config/prisma";

export class UserRepository {
  findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, email: true, profilePicUrl: true, createdAt: true }
    });
  }

  follow(followerId: string, followingId: string) {
    return prisma.follow.create({
      data: { followerId, followingId }
    });
  }

  unfollow(followerId: string, followingId: string) {
    return prisma.follow.delete({
      where: { followerId_followingId: { followerId, followingId } }
    });
  }

  isFollowing(followerId: string, followingId: string) {
    return prisma.follow.findUnique({
      where: { followerId_followingId: { followerId, followingId } }
    });
  }

  getFollowedIds(userId: string) {
    return prisma.follow.findMany({
      where: { followerId: userId },
      select: { followingId: true }
    });
  }

  countFollowers(userId: string) {
    return prisma.follow.count({ where: { followingId: userId } });
  }

  countFollowing(userId: string) {
    return prisma.follow.count({ where: { followerId: userId } });
  }
}
