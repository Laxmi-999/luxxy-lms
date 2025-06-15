// File: controllers/userController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';


const JWT_SECRET = 'abcdefghijkalmnopqrstuvwxyz1234567890'

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, {
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

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
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
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  console.log(`User logged in successfully: ID - ${user._id}, Email - ${user.email}, Username - ${user.name}, role-${user.role} token-${token}`);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// // Get user profile
// export const getUserProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// // Admin updates user role
// export const updateUserRole = async (req, res) => {
//   const { id } = req.params;
//   const { role } = req.body;

//   try {
//     const user = await User.findById(id);
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     user.role = role;
//     await user.save();

//     res.json({ message: 'User role updated', user });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };

// // Admin get all users
// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.find().select('-password');
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// };
