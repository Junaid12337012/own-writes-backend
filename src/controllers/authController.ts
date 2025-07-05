import { Request, Response, NextFunction } from 'express';
import { registerUser, loginUser } from '../services/authService';

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { username, email, password } = req.body;
    const user = await registerUser(username, email, password);
    res.status(201).json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.json({ success: true, user, token });
  } catch (err) {
    next(err);
  }
}
