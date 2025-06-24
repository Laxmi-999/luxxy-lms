// File: controllers/userController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';



const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRETE, {
    expiresIn: '1d',
  });
};


// Register a new user (default role: member)
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  console.log('requested data are', username, password, email);
  

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: username,
      email,
      password: hashedPassword,
      role: 'member',
    });


    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    console.log('user is', user);
    
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: 'Server error', error });
  }
};


// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'can not found email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('password not match');
      
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isLoggedIn:true,
      message :"logged In successfully",
      token,
    });
  console.log(`User logged in successfully: ID - ${user._id}, Email - ${user.email}, Username - ${user.name}, role-${user.role} token-${token}`);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

