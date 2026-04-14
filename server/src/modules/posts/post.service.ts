import { AppError, assert } from "../../utils/errors";
import { PostRepository } from "./post.repository";

export class PostService {
  private repo = new PostRepository();

  async createPost(userId: string, imageUrl: string, caption?: string) {
    return this.repo.createPost({ userId, imageUrl, caption });
  }

  async likePost(userId: string, postId: string) {
    const post = await this.repo.findById(postId);
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    try {
      await this.repo.addLike(userId, postId);
    } catch (error) {
      return { status: "already_liked" };
    }

    return { status: "liked" };
  }

  async unlikePost(userId: string, postId: string) {
    const post = await this.repo.findById(postId);
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    try {
      await this.repo.removeLike(userId, postId);
    } catch (error) {
      return { status: "not_liked" };
    }

    return { status: "unliked" };
  }

  async commentOnPost(userId: string, postId: string, content: string) {
    assert(content.trim().length > 0, "Comment cannot be empty", 400);

    const post = await this.repo.findById(postId);
    if (!post) {
      throw new AppError("Post not found", 404);
    }

    return this.repo.addComment(userId, postId, content);
  }

  async listComments(postId: string) {
    return this.repo.listComments(postId);
  }
}
