import mongoose, { Document, Schema, Types } from "mongoose";

export interface IBooking extends Document {
  propertyId: Types.ObjectId;
  roomId: Types.ObjectId;
  tenantId: Types.ObjectId;
  checkIn: Date;
  checkOut?: Date;
  status: "checked_in" | "checked_out" | "cancelled";
  notes?: string;
}

const bookingSchema = new Schema<IBooking>(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    roomId: { type: Schema.Types.ObjectId, ref: "Room", required: true },
    tenantId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date },
    status: { type: String, enum: ["checked_in", "checked_out", "cancelled"], default: "checked_in" },
    notes: { type: String }
  },
  { timestamps: true }
);

// ensure one active booking per room
bookingSchema.index({ roomId: 1, status: 1 }, { unique: true, partialFilterExpression: { status: "checked_in" } });

export default mongoose.model<IBooking>("Booking", bookingSchema);