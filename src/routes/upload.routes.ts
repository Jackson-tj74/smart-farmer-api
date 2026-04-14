import { Router } from 'express';
import multer from 'multer';
import { analyzeDisease } from '../controllers/upload.controller';
import { authenticate } from '../middleware/auth';

const uploadRouter = Router();

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

uploadRouter.post('/disease', authenticate, upload.single('image'), analyzeDisease);

export default uploadRouter;