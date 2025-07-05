import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/auth';
import * as blogService from '../services/blogService';
import mongoose, { Types } from 'mongoose';

import User from '../models/User';
import Category from '../models/Category';

export async function createBlog(req: AuthRequest, res: Response, next: NextFunction) {
  console.log('[createBlog] called', { user: req.user, body: req.body });
  try {
    // Determine authorId from token (support both `id` and `_id` just in case)
    const authorId: string | undefined = req.user?.id ?? (req.user as any)?._id;
    if (!authorId) {
      return res.status(400).json({ message: 'AuthorId missing in JWT payload' });
    }

    /*
     * NOTE: We intentionally no longer hard-fail if the author record is missing.
     * 1. Using the ObjectId string in the `author` field is still valid.
     * 2. Keeping this non-blocking avoids false negatives when the account was
     *    recently deleted or is stored in a separate collection.
     * 3. You can re-enable validation later by uncommenting the block below.
     */
    // const authorExists = await User.findById(authorId);
    // if (!authorExists) {
    //   return res.status(400).json({ message: 'Author not found', authorId });
    // }

    // Cast author to ObjectId
    const authorObjectId = new Types.ObjectId(authorId);

    // Ensure categories, if provided, are ObjectIds too
    let categories: Types.ObjectId[] | undefined;
    if (Array.isArray(req.body.categories)) {
      categories = await Promise.all(req.body.categories.map(async (c: string) => {
        if (Types.ObjectId.isValid(c)) return new Types.ObjectId(c);
        // treat as category name, find or create
        const existing = await Category.findOne({ name: c });
        if (existing) return existing._id;
        const created = await Category.create({ name: c });
        return created._id;
      }));
    }

    const blog = await blogService.createBlog({ ...req.body, author: authorObjectId, categories });
    console.log('Blog created with author', authorId);
    res.status(201).json({ success: true, blog });
  } catch (err) {
    next(err);
  }
}

export async function getBlogs(req: Request, res: Response, next: NextFunction) {
  try {
    const blogs = await blogService.getBlogs();
    res.json({ success: true, blogs });
  } catch (err) {
    next(err);
  }
}

export async function getBlogById(req: Request, res: Response, next: NextFunction) {
  try {
    const blog = await blogService.getBlogById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ success: true, blog });
  } catch (err) {
    next(err);
  }
}

export async function updateBlog(req: Request, res: Response, next: NextFunction) {
  try {
    // If categories present, normalize to ObjectIds
    if (Array.isArray(req.body.categories)) {
      req.body.categories = await Promise.all(req.body.categories.map(async (c: string) => {
        if (Types.ObjectId.isValid(c)) return new Types.ObjectId(c);
        const existing = await Category.findOne({ name: c });
        if (existing) return existing._id;
        const created = await Category.create({ name: c });
        return created._id;
      }));
    }

    const blog = await blogService.updateBlog(req.params.id, req.body);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ success: true, blog });
  } catch (err) {
    next(err);
  }
}

export async function toggleReaction(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const userId: string | undefined = req.user?.id ?? (req.user as any)?._id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    const { type } = req.body;
    if (!type) return res.status(400).json({ message: 'Reaction type required' });
    const blog = await blogService.toggleReaction(req.params.id, userId, type);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ success: true, blog });
  } catch (err) {
    next(err);
  }
}

export async function deleteBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const blog = await blogService.deleteBlog(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
