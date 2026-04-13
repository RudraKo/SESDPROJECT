import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";

const service = new UserService();

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await service.getProfile(req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const followUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user?.id as string;
    const result = await service.follow(followerId, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const unfollowUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const followerId = req.user?.id as string;
    const result = await service.unfollow(followerId, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
