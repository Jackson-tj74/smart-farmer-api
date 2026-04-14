import { Response } from 'express';
import { Chat } from '../model/Chat';
import { Message } from '../model/Message';
import { openai,MODEL } from '../config/openai';
import { DISEASE_DETECTION_PROMPT } from '../utils/farmPrompts';
import fs from 'fs';

export const analyzeDisease = async (req: any, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const userId = req.user.userId;
    const imageBase64 = fs.readFileSync(req.file.path).toString('base64');
    const imageUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

    // Create Chat if not exists
    let chat = await Chat.findOne({ _id: req.body.chatId, userId });
    if (!chat) {
      chat = await Chat.create({ userId, title: 'Isuzuma ry\'indwara' });
    }

    // Save User Message with Image
    const userMsg = await Message.create({
      chatId: chat._id,
      sender: 'user',
      content: 'Nshyizeho ifoto y\'ibinyamisogota byanduye.',
      imageUrl: req.file.path,
    });

    // Call OpenAI Vision
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        { role: 'system', content: DISEASE_DETECTION_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Suzuma ifoto iyi' },
            { type: 'image_url', image_url: { url: imageUrl } }
          ]
        }
      ],
      max_tokens: 1000,
    });

    let content = response.choices[0].message.content || "Ntabwo bishoboka gusuzuma.";
    let diseaseData = null;

    // Try to parse JSON if present
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        diseaseData = JSON.parse(jsonMatch[0]);
        content = diseaseData.advice || content;
      }
    } catch (e) {
      console.log("Could not parse JSON from AI response");
    }

    // Save AI Response
    const aiMsg = await Message.create({
      chatId: chat._id,
      sender: 'assistant',
      content: content,
      diseaseInfo: diseaseData,
    });

    // Cleanup uploaded file
    fs.unlinkSync(req.file.path);

    res.json({ message: aiMsg, chatId: chat._id, diseaseInfo: diseaseData });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};