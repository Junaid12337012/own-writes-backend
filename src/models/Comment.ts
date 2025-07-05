import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  blog: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  content: string;
  approved: boolean;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IComment>('Comment', CommentSchema);
