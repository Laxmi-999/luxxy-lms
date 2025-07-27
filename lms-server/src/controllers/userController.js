// import Book from '../models/Book.js';

import Book from "../models/book.js";
import User from "../models/user.js";
import bcrypt from 'bcryptjs';


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
    console.log('users are', users);
    
   return  res.status(200).json(users);
  } catch (error) {
    console.log('error is while getting users', error);
    
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// Update user
export const updateUsere = async (req, res) => {
  try {
    const userId = req.params.id;
    const  userData  = req.body;
 
    console.log('userId', userId , 'formDat', userData);
    
    if (!userId || !userData) {
      return res.status(400).json({ message: 'User ID and update data are required.' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      userData, // Pass the entire userData object for update
      { new: true, runValidators: true } // runValidators ensures schema validators run on update
    ).select('-password');


    // Check if the user was found and updated
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user); 
  } catch (error) {
    console.error("Error updating user:", error); 
    res.status(500).json({ message: 'Failed to update user.' });
  }
};

// Add a user
export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('user details are', name, email, password);
    

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });
      

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword, role: 'member' });
    const userWithoutPassword = { ...newUser._doc };
    delete userWithoutPassword.password;
    console.log('user is ', newUser);
    

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add new user' });
  }
};

// Add a librarian
export const addLibrarian = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('librarian details are', name, email, password);

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'librarian',
      status: 'idle' // Set the status explicitly for librarians
    });

    const userWithoutPassword = { ...newUser._doc };
    delete userWithoutPassword.password;
    console.log('librarian is ', newUser);

    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error adding librarian:', error); // Log the actual error for debugging
    res.status(500).json({ message: 'Failed to add librarian' });
  }
};



//delete user
export const deleteUser = async(req, res) => {

  try {

    const userId = req.params.id;
     if(!userId){
      return res.status(400).json({message: 'user id is required in URL'})
     }

     const user = await User.findByIdAndDelete(userId);
     if(!user){
      return res.status(400).json({message: "user not found"})
     }
     
     return res.status(200).json({message: "User deleted successfully"})
    
  } catch (error) {
    console.log('error while deleting user', error);
    res.status(500).json({ message: 'Failed to delete user.' });
    
    
  }
}


