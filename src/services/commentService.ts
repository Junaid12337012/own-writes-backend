import Comment, { IComment } from '../models/Comment';
import Blog from '../models/Blog';

export async function createComment(data: Partial<IComment>) {
  const comment = await Comment.create(data);
  await Blog.findByIdAndUpdate(comment.blog, { $push: { comments: comment._id } });
  return comment;
}

export async function getCommentsForBlog(blogId: string) {
  return await Comment.find({ blog: blogId, approved: true }).populate('author', 'username');
}

export async function moderateComment(id: string, approved: boolean) {
  return await Comment.findByIdAndUpdate(id, { approved }, { new: true });
}

export async function deleteComment(id: string) {
  return await Comment.findByIdAndDelete(id);
}
