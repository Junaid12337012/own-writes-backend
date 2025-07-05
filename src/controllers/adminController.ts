import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Blog from '../models/Blog';

export async function getAnalytics(req: Request, res: Response, next: NextFunction) {
  try {
    // Mocked analytics data
    const totalUsers = await User.countDocuments();
    const totalBlogs = await Blog.countDocuments();
    const publishedBlogs = await Blog.countDocuments({ published: true });
    const draftBlogs = totalBlogs - publishedBlogs;
    const data = {
      totalUsers,
      totalBlogs,
      publishedBlogs,
      draftBlogs,
      // Add more analytics as needed
    };
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const users = await User.find({}, '-password');
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { role } = req.body;
    if (!role) return res.status(400).json({ message: 'Role is required' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, select: '-password' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}

export async function getAllBlogs(req: Request, res: Response, next: NextFunction) {
  try {
    const blogs = await Blog.find().populate('author', 'username');
    res.json({ success: true, blogs });
  } catch (err) {
    next(err);
  }
}

export async function getPendingComments(req: Request, res: Response, next: NextFunction){
  try{
    const comments = await (await import('../models/Comment')).default.find({ approved:false }).populate('author','username').populate('blog','title');
    res.json({success:true, comments});
  }catch(err){next(err);} }

export async function moderateComment(req: Request, res: Response, next: NextFunction){
  try{
    const {approved}=req.body;
    const CommentModel = (await import('../models/Comment')).default;
    const comment= await CommentModel.findByIdAndUpdate(req.params.id,{approved},{new:true});
    if(!comment) return res.status(404).json({message:'Comment not found'});
    res.json({success:true, comment});
  }catch(err){next(err);} }

export async function deleteBlog(req: Request, res: Response, next: NextFunction) {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
