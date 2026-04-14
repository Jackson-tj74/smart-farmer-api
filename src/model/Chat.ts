
import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  messageCount: number;
  lastMessageAt?: Date;
}

const ChatSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, default: 'New Chat' },
  messageCount: { type: Number, default: 0 },
  lastMessageAt: { type: Date },
}, { timestamps: true });

export const Chat: Model<IChat> = mongoose.model<IChat>('Chat', ChatSchema);