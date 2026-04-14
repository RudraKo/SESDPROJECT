import { Request, Response, NextFunction } from "express";
import { PostService } from "./post.service";

const service = new PostService();

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;
    const { imageUrl, caption } = req.body;
    const post = await service.createPost(userId, imageUrl, caption);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

export const likePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;
    const result = await service.likePost(userId, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const unlikePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;
    const result = await service.unlikePost(userId, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;
    const { content } = req.body;
    const comment = await service.commentOnPost(userId, req.params.id, content);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

export const listComments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const comments = await service.listComments(req.params.id);
    res.json(comments);
  } catch (error) {
    next(error);
  }
};
