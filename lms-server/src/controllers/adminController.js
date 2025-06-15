// import Book from '../models/Book.js';

import User from "../models/user.js";

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
    
  try {
    const admin = await User.findById(req.user.id).select('-password');
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch admin profile' });
  }
};

// Get all users (for managing users/roles)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const user = await User.findByIdAndUpdate(userId, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user role' });
  }
};

// Add a librarian
export const addLibrarian = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('librarian details are', name, email, password);
    

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const newUser = await User.create({ name, email, password, role: 'librarian' });
    const userWithoutPassword = { ...newUser._doc };
    delete userWithoutPassword.password;
    console.log('librarian is ', newUser);
    

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add librarian' });
  }
};

// View all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};

// Reports (basic example)
export const getReport = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const bookCount = await Book.countDocuments();
    res.json({ totalUsers: userCount, totalBooks: bookCount });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};
