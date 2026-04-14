import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IMessage extends Document {
  chatId: mongoose.Types.ObjectId;
  sender: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
  diseaseInfo?: any; // Result from image analysis
}

const MessageSchema: Schema = new Schema({
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true, index: true },
  sender: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  diseaseInfo: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

// Update parent chat count after saving a message
MessageSchema.post('save', async function (doc) {
  const Chat = mongoose.model('Chat');
  await Chat.findByIdAndUpdate(doc.chatId, {
    $inc: { messageCount: 1 },
    lastMessageAt: new Date()
  });
});

export const Message: Model<IMessage> = mongoose.model<IMessage>('Message', MessageSchema);