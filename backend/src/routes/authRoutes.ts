import express, { Request, Response, Router } from 'express';import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

// Verify token route
router.get('/verify-token', async (req : any, res : any) => {
    try {
      const token = req.headers.authorization?.split(' ')[1]; // Extract token from Bearer token
      
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }
  
      jwt.verify(token, process.env.JWT_SECRET as string, async (err : any, decoded : any) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid or expired token' });
        }
  
        // Token is valid, fetch user data. Decoded is the _id. Exclude the password
        const user = await User.findById((decoded as any).userId).select('-password');
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        // Return user data
        res.json(user);
      });
    } catch (error) {
      res.status(500).json({ message: 'Error verifying token', error });
    }
  });

// Signup route
router.post('/signup', async (req : any, res : any ) => {
    try {
      const { username, password } = req.body;
  
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create new user
      const newUser = new User({
        username,
        password: hashedPassword,
      });
  
      await newUser.save();
  
      // Create and sign JWT
      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
  
      res.status(201).json({ token, username });
    } catch (error) {
      res.status(500).json({ message: error });
    }
  });

// Login route
router.post('/login', async (req : any, res : any) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

    res.json({ token, username });
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;