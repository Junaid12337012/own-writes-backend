import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth';

export async function getMe(req: AuthRequest, res: Response, next: NextFunction){
  try{
    const user = await User.findById(req.user.id).select('-password');
    res.json({success:true, user});
  }catch(err){next(err);} }

export async function updateMe(req: AuthRequest, res: Response, next: NextFunction){
  try{
    const allowed = ['username','bio','profilePictureUrl'];
    const updates: any = {};
    for(const key of allowed){ if(key in req.body) updates[key] = req.body[key]; }
    const user = await User.findByIdAndUpdate(req.user.id, updates, {new:true}).select('-password');
    res.json({success:true, user});
  }catch(err){next(err);} }
