import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function registerUser(username: string, email: string, password: string) {
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) throw { status: 400, message: 'User already exists' };
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ username, email, password: hashed });
  return user;
}

export async function loginUser(email: string, password: string) {
  const user = await User.findOne({ email });
  if (!user) throw { status: 400, message: 'Invalid credentials' };
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 400, message: 'Invalid credentials' };
  const u = user as IUser;
  const token = jwt.sign({ id: (u._id as any).toString(), role: u.role }, process.env.JWT_SECRET as string, { expiresIn: '7d' });
  // Ensure returned user object has _id as string (for frontend localStorage)
  const safeUser = { ...u.toObject(), _id: (u._id as any).toString() };
  return { user: safeUser, token };
}
