import { Request, Response } from "express";
import Booking from "../models/Booking";
import Room from "../models/Room";
import User from "../models/User";

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { propertyId, roomId, tenantId, checkIn, notes } = req.body;

    const booking = await Booking.create({
      propertyId,
      roomId,
      tenantId,
      checkIn,
      status: "checked_in",
      notes
    });

    await Room.findByIdAndUpdate(roomId, { status: "booked", assignedTo: tenantId });
    await User.findByIdAndUpdate(tenantId, { assignedRoom: roomId, status: "active" });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllBookings = async (_req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().populate("propertyId roomId tenantId");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("propertyId roomId tenantId");
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const checkOutBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.status !== "checked_in") {
      return res.status(400).json({ message: "Invalid booking status" });
    }

    booking.status = "checked_out";
    booking.checkOut = new Date();
    await booking.save();

    await Room.findByIdAndUpdate(booking.roomId, { status: "available", assignedTo: null });
    await User.findByIdAndUpdate(booking.tenantId, { assignedRoom: null, status: "inactive" });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking || booking.status !== "checked_in") {
      return res.status(400).json({ message: "Cannot cancel non-active booking" });
    }

    booking.status = "cancelled";
    await booking.save();

    await Room.findByIdAndUpdate(booking.roomId, { status: "available", assignedTo: null });
    await User.findByIdAndUpdate(booking.tenantId, { assignedRoom: null, status: "inactive" });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
