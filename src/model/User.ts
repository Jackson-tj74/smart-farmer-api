import mongoose, { Document, Schema, Model } from 'mongoose';


export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: 'farmer' | 'buyer' | 'provider';
  location?: string; 
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