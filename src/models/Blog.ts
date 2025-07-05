import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  featuredImage?: string;
  author: mongoose.Types.ObjectId;
  categories: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  published: boolean;
  reactions: Record<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  featuredImage: { type: String },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  published: { type: Boolean, default: false },
  reactions: { type: Map, of: [String], default: {} },
}, { timestamps: true });

export default mongoose.model<IBlog>('Blog', BlogSchema);
