import { Request, Response, NextFunction } from "express";
import { FeedService } from "./feed.service";

const service = new FeedService();

export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id as string;
    const feed = await service.getUserFeed(userId);
    res.json(feed);
  } catch (error) {
    next(error);
  }
};
