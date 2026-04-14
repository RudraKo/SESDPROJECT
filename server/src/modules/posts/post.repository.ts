import { prisma } from "../../config/prisma";

export class PostRepository {
  createPost(data: { userId: string; imageUrl: string; caption?: string }) {
    return prisma.post.create({
      data,
      include: {
        user: { select: { id: true, username: true, profilePicUrl: true } },
        _count: { select: { likes: true, comments: true } }
      }
    });
  }

  findById(postId: string) {
    return prisma.post.findUnique({ where: { id: postId } });
  }

  listFeedPosts(userIds: string[], viewerId: string) {
    return prisma.post.findMany({
      where: { userId: { in: userIds } },
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, username: true, profilePicUrl: true } },
        _count: { select: { likes: true, comments: true } },
        likes: { where: { userId: viewerId }, select: { userId: true } }
      }
    });
  }

  addLike(userId: string, postId: string) {
    return prisma.like.create({ data: { userId, postId } });
  }

  removeLike(userId: string, postId: string) {
    return prisma.like.delete({ where: { userId_postId: { userId, postId } } });
  }

  addComment(userId: string, postId: string, content: string) {
    return prisma.comment.create({
      data: { userId, postId, content },
      include: { user: { select: { id: true, username: true, profilePicUrl: true } } }
    });
  }

  listComments(postId: string) {
    return prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: { user: { select: { id: true, username: true, profilePicUrl: true } } }
    });
  }
}
