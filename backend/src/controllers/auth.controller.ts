import User from '../models/user.model';
import { NextFunction, Request, Response } from 'express';
import { comparePassword, generateToken, hashPassword } from '../utils/auth';
import ErrorHandler from '../utils/errorHandler';

// user signup
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, phone, idType, idNumber, status, address, note, assignedRoom } = req.body;

    if (!name || !email || !password) {
      return next(new ErrorHandler("Email, Username, or Password cannot be empty", 400));
    }

    // Check if user already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return next(new ErrorHandler("User already exists", 400));
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const user = await User.create({ name, email, password: hashedPassword, phone, idType, idNumber, status, address, note, assignedRoom });

    res.status(201).json({
      success: true,
      user,
    });

  } catch (error:any) {
    console.log(error);
    next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};


// user login
export const login = async (req: Request, res: Response, next: NextFunction) => {

  try {
    const { email, password } = req.body;

    if ( !email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    // Find user and validate password
    const user = await User.findOne({ email }).select("+password")
    console.log("user8",user)
    if (!user) {
      return next(new ErrorHandler("Invalid username or password", 401));
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return next(new ErrorHandler("Invalid username or password", 401));
    }

    // Generate token and set cookie
    const token = generateToken(user.id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({
      success: true,
      user,
      token,
    });

  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};

// user logout
export const logout = async (req: Request, res: Response, next:NextFunction) => {

  try {
      // Clear the token cookie
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
    
      res.status(200).json({success:true,message:"Logout Successfully"});

  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};