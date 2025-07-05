import Blog, { IBlog } from '../models/Blog';
import { Types } from 'mongoose';

export async function createBlog(data: Partial<IBlog>) {
  return await Blog.create(data);
}

export async function getBlogs(filter = {}) {
  return await Blog.find(filter).populate('author', 'username').populate('categories').populate({ path: 'comments', match: { approved: true } });
}

export async function getBlogById(id: string) {
  return await Blog.findById(id).populate('author', 'username').populate('categories').populate({ path: 'comments', match: { approved: true } });
}

export async function updateBlog(id: string, data: Partial<IBlog>) {
  return await Blog.findByIdAndUpdate(id, data, { new: true });
}

export async function deleteBlog(id: string) {
  return await Blog.findByIdAndDelete(id);
}

export async function toggleReaction(blogId: string, userId: string, type: string) {
  const blog = await Blog.findById(blogId);
  if (!blog) return null;
  const reactions = blog.reactions as any;
  if (!reactions.get(type)) {
    reactions.set(type, []);
  }
  const arr: string[] = reactions.get(type);
  const idx = arr.indexOf(userId);
  if (idx >= 0) {
    arr.splice(idx, 1); // remove reaction
  } else {
    arr.push(userId);
  }
  reactions.set(type, arr);
  blog.markModified('reactions');
  await blog.save();
  return blog;
}
