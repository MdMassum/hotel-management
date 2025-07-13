// src/types/express/index.d.ts
import * as express from 'express';
import { Request } from "express";
import { IUser } from '../models/user.model';
declare global {
  namespace Express {
    interface Request {
      userId: string;
      user:IUser
    }
  }
}

export interface AuthenticatedRequest extends Request {
  userId?: string;
  user?:IUser | null;
}
