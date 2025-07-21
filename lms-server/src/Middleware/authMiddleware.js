import jwt from 'jsonwebtoken';
import User from '../models/user.js';




// Protect route or isTokenVerify
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRETE);
      req.user = await User.findById(decoded.id).select('-password');
      console.log('success');
      

      next();
    } catch (error) {
        console.log(error);
        
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Only Admin
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

// Only Librarians
export const isLibrarian = (req, res, next) => {
  if (req.user && req.user.role === 'librarian') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Librarians only' });
  }
};

// member only 
export const isMember = (req, res, next) => {
  if (req.user.role === 'member') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Members only.' });
  }
};
