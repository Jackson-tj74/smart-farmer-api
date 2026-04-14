import { Response } from 'express';
import { Chat } from '../model/Chat';
import { Message } from '../model/Message';
import { User } from '../model/User';
import { openai,MODEL } from '../config/openai';
import { FARM_SYSTEM_PROMPT } from '../utils/farmPrompts';
import { chatMessageSchema } from '../utils/validators';

export const sendMessage = async (req: any, res: Response) => {
  try {
    const { message, chatId } = chatMessageSchema.parse(req.body);
    const userId = req.user.userId;

    // 1. Get or Create Chat
    let chat;
    if (chatId) {
      chat = await Chat.findOne({ _id: chatId, userId });
      if (!chat) return res.status(404).json({ message: 'Chat not found' });
    } else {
      chat = await Chat.create({ userId, title: message.substring(0, 30) + '...' });
    }

    // 2. Save User Message
    await Message.create({ chatId: chat._id, sender: 'user', content: message });

    // 3. Get History & Context
    const history = await Message.find({ chatId: chat._id }).sort({ createdAt: 1 }).limit(10);
    const user = await User.findById(userId);

    // 4. Build OpenAI Messages
    const messages = [
      { role: 'system', content: `${FARM_SYSTEM_PROMPT}\nUser Location: ${user?.location || 'Unknown'}\nUser Crops: ${user?.crops?.join(', ') || 'None'}` },
      ...history.map(h => ({ role: h.sender, content: h.content })),
    ];

    // 5. Call OpenAI
    const completion = await openai.chat.completions.create({
      model: MODEL,
      messages: messages as any,
      max_tokens: 500,
    });

    const aiResponse = completion.choices[0].message.content || "Ntabwo bishoboka.";

    // 6. Save AI Message
    const aiMessage = await Message.create({
      chatId: chat._id,
      sender: 'assistant',
      content: aiResponse,
    });

    res.json({ message: aiMessage, chatId: chat._id });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getChats = async (req: any, res: Response) => {
  const chats = await Chat.find({ userId: req.user.userId }).sort({ updatedAt: -1 });
  res.json(chats);
};

export const getMessages = async (req: any, res: Response) => {
  const { chatId } = req.params;
  const messages = await Message.find({ chatId }).sort({ createdAt: 1 });
  res.json(messages);
};