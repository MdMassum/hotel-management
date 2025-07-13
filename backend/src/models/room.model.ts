import mongoose, { Document, Schema, Types } from "mongoose";

export interface IRoom extends Document {
  propertyId: Types.ObjectId;
  roomNumber: string;
  type: "single" | "double" | "deluxe";
  daily_rent: number;
  monthly_rent: number;
  yearly_rent: number;
  status: "available" | "booked";
  assignedTo?: Types.ObjectId;
}

const roomSchema = new Schema<IRoom>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true
    },
    roomNumber: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ["single", "double", "deluxe"],
      required: true
    },
    daily_rent: {
      type: Number,
      required: true
    },
    monthly_rent: {
      type: Number,
      required: true
    },
    yearly_rent: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ["available", "booked"],
      default: "available"
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

// unique room per property
roomSchema.index({ propertyId: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model<IRoom>("Room", roomSchema);
