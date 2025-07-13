import mongoose, { Document, Schema, Types } from "mongoose";

export interface IProperty extends Document {
  name: string;
  location: string;
  description?: string;
  createdBy: Types.ObjectId;
}

const propertySchema = new Schema<IProperty>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// unique per admin
propertySchema.index({ createdBy: 1, name: 1 }, { unique: true });

export default mongoose.model<IProperty>("Property", propertySchema);
