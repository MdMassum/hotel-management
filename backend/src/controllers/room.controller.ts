import { NextFunction, Request, Response } from "express";
import Room from "../models/room.model";
import User from "../models/user.model";
import ErrorHandler from "../utils/errorHandler";

export const createRoom = async (req: Request, res: Response, next:NextFunction) => {

  try {
    const room = await Room.create(req.body);
    res.status(200).json({
      success:true,
      room
    });

  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};

export const getAllRooms = async (req:Request, res:Response, next:NextFunction) =>{

  try {
    const rooms = await Room.find().populate("propertyId assignedTo");

    res.status(200).json({
      success:true,
      rooms
    });

  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
}


export const getRoomsByProperty = async (req: Request, res: Response, next:NextFunction) => {

  try {
    const rooms = await Room.find({ propertyId: req.params.propertyId });
    res.status(200).json({
      success:true,
      rooms
    });

  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};

export const assignRoomToTenant = async (req: Request, res: Response, next:NextFunction) => {

  try {
    const { roomId, tenantId } = req.body;
    const room = await Room.findByIdAndUpdate(roomId, { status: "booked", assignedTo: tenantId }, { new: true });
    await User.findByIdAndUpdate(tenantId, { assignedRoom: roomId, status: "active" });
    
    res.status(200).json({
      success:true,
      room
    });

  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};

export const releaseRoom = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (room?.assignedTo) {
      await User.findByIdAndUpdate(room.assignedTo, { assignedRoom: null, status: "inactive" });
    }
    room!.assignedTo = undefined;
    room!.status = "available";
    await room!.save();

    res.status(200).json({
      success:true,
      room
    });

  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};

export const updateRoom = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const {propertyId, roomNumber, type, daily_rent, monthly_rent, yearly_rent, status, assignedTo} = req.body;
    const room = await Room.findByIdAndUpdate(req.params.id, 
      {propertyId, roomNumber, type, daily_rent, monthly_rent, yearly_rent, status, assignedTo}, 
      { new: true });
    if(!room){
      return next(new ErrorHandler("No Room Found", 404));
    }

    res.status(200).json({
      success:true,
      room
    });
  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};

export const deleteRoom = async (req: Request, res: Response, next:NextFunction) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if(!room){
      return next(new ErrorHandler("No Room Found", 404));
    }

    res.status(200).json({
      success:true,
      message: "Room deleted Success"
    });
  } catch (error:any) {
    return next(new ErrorHandler(error.message || "Internal server error", 500));
  }
};