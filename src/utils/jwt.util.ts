import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const SECRET = process.env.JWT_SECRET || 'secret';


export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const generateToken = (userId: string, email: string, role: string) => {
  return jwt.sign({ userId, email, role }, SECRET, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, SECRET) as { userId: string; email: string; role: string };
};

export const comparePassword = async (
  candidatePassword: string, 
  storedPassword: string
): Promise<boolean> => {
  try {
   
    return await bcrypt.compare(candidatePassword, storedPassword);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};