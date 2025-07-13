import { Response, NextFunction, Request } from "express";
import { verifyToken } from "../utils/auth";
import { AuthenticatedRequest } from "../types/express";
import ErrorHandler from "../utils/errorHandler";
import User from '../models/user.model'

export const authenticate = async(req: AuthenticatedRequest, res: Response, next: NextFunction) => {

  const token = req.cookies?.token

  if (!token) {
    return next(new ErrorHandler("Access denied, Please Login First !!",401));
  }

  try {

    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    req.user = await User.findById(decoded.userId);
    next();
    
  } catch (err) {
    return next(new ErrorHandler("Invalid token",401));
  }
};

export const authorizeRoles = (...roles:any) =>{
  return(req:Request, res:Response, next:NextFunction) =>{

      if(!roles.includes(req.user.role)){
          return next(new ErrorHandler(`Role : ${req.user.role} is not authorize to access this resourcess`,403));
      }
      next();
  }
}
