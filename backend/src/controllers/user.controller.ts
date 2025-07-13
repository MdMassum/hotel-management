import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";



export const getAllTenants = async (_req: Request, res: Response, next:NextFunction) => {
  try {
    const tenants = await User.find({ role: "tenant" });
    res.status(200).json({
      success:true,
      tenants
    });
  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};

export const getUserById = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const user = await User.findById(req.params.id).populate("assignedRoom");

    if(!user){
      return next(new ErrorHandler("No User Found", 404));
    }

    res.status(200).json({
      success:true,
      user
    });
  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};

export const updateUserStatus = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if(!user){
      return next(new ErrorHandler("No User Found", 404));
    }

    res.status(200).json({
      success:true,
      user
    });
  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};

export const deleteUser = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if(!user){
      return next(new ErrorHandler("No User Found", 404));
    }

    res.status(200).json({
      success:true,
      message: "User deleted Success"
    });
  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};