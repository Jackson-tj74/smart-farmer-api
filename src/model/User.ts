import mongoose, { Document, Schema, Model } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'farmer' | 'buyer' | 'provider';
  location?: string; // Province/District in Rwanda
  crops?: string[];
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['farmer', 'buyer', 'provider'], default: 'farmer' },
  location: { type: String },
  crops: [{ type: String }],
}, { timestamps: true });




export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);