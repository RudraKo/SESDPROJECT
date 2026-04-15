import { UserService } from "../users/user.service";
import { PostRepository } from "../posts/post.repository";

export class FeedService {
  private users = new UserService();
  private posts = new PostRepository();

  async getUserFeed(userId: string) {
    const followedIds = await this.users.getFollowedIds(userId);
    const userIds = [userId, ...followedIds];
    const posts = await this.posts.listFeedPosts(userIds, userId);

    return posts.map((post) => ({
      id: post.id,
      imageUrl: post.imageUrl,
      caption: post.caption,
      createdAt: post.createdAt,
      user: post.user,
      likesCount: post._count.likes,
      commentsCount: post._count.comments,
      likedByMe: post.likes.length > 0
    }));
  }
}
