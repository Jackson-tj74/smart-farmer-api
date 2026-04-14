import { Request, Response } from 'express';
import { User } from '../model/User';
import { generateToken, comparePassword } from '../utils/jwt.util'; // Import comparePassword
import { registerSchema } from '../utils/validators';

export const register = async (req: Request, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = await User.findOne({ email: data.email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const user = await User.create(data);
    const token = generateToken(user._id.toString(), user.email, user.role);

    res.status(201).json({ user, token });
  } catch (error: any) {
    res.status(400).json({ message: error.errors || error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // 1. Find user and explicitly select the password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Compare password using the utility
    // Note: Ensure 'password' is not null before comparing
    const isMatch = await comparePassword(password, user.password || '');

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Generate Token
    const token = generateToken(user._id.toString(), user.email, user.role);
    
    // 4. Create a safe user object using destructuring
    // This separates 'password' into its own variable and puts the rest in 'userResponse'
    const { password: _, ...userResponse } = user.toObject();

    res.json({ user: userResponse, token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.userId);
    res.json(user);
  } catch (error) {
    res.status(404).json({ message: 'User not found' });
  }
};