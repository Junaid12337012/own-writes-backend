import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as commentService from '../services/commentService';

export async function createComment(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const comment = await commentService.createComment({ ...req.body, author: req.user.id });
    res.status(201).json({ success: true, comment });
  } catch (err) {
    next(err);
  }
}

export async function getCommentsForBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const comments = await commentService.getCommentsForBlog(req.params.blogId);
    res.json({ success: true, comments });
  } catch (err) {
    next(err);
  }
}

export async function moderateComment(req: Request, res: Response, next: NextFunction) {
  try {
    const comment = await commentService.moderateComment(req.params.id, req.body.approved);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json({ success: true, comment });
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req: Request, res: Response, next: NextFunction) {
  try {
    const comment = await commentService.deleteComment(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
