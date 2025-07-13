import { Request, Response } from "express";
import Room from "../models/Room";
import User from "../models/User";

export const createRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomsByProperty = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find({ propertyId: req.params.propertyId });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const assignRoomToTenant = async (req: Request, res: Response) => {
  try {
    const { roomId, tenantId } = req.body;
    const room = await Room.findByIdAndUpdate(roomId, { status: "booked", assignedTo: tenantId }, { new: true });
    await User.findByIdAndUpdate(tenantId, { assignedRoom: roomId, status: "active" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const releaseRoom = async (req: Request, res: Response) => {
  try {
    const room = await Room.findById(req.params.roomId);
    if (room?.assignedTo) {
      await User.findByIdAndUpdate(room.assignedTo, { assignedRoom: null, status: "inactive" });
    }
    room!.assignedTo = undefined;
    room!.status = "available";
    await room!.save();
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
