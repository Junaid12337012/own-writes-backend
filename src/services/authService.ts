import User, { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

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
  // Users created via Google OAuth won't have a local password
  if (!user.password) throw { status: 400, message: 'Please login with Google' };
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw { status: 400, message: 'Invalid credentials' };
  const u = user as IUser;
  const safeUserId = (u._id as any).toString();
  const token = jwt.sign({ id: safeUserId, role: u.role }, JWT_SECRET, { expiresIn: '7d' });
  // Ensure returned user object has _id as string (for frontend localStorage)
  const safeUser = { ...u.toObject(), _id: safeUserId };
  return { user: safeUser, token };
}
