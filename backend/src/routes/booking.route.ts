import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  checkOutBooking,
  cancelBooking
} from "../controllers/booking.controller";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getAllBookings);
router.get("/:id", getBookingById);
router.patch("/:id/checkout", checkOutBooking);
router.patch("/:id/cancel", cancelBooking);

export default router;