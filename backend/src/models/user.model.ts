import mongoose, { Document, Schema, Types } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "tenant" | "admin";
  phone?: string;
  idType?: "aadhar" | "passport" | "driving_license" | "other";
  idNumber?: string;
  status: "active" | "inactive"; 
  address?: string;
  note?: string;
  assignedRoom?: Types.ObjectId;
}

const userSchema = new Schema<IUser>(
  {
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true,
      index:true
    },
    password: { 
      type: String, 
      required: true,
      select:false
    },
    role: { 
      type: String, 
      enum: ["tenant", "admin"], 
      default: "tenant" 
    },
    phone: { 
      type: String 
    },
    idType: { 
      type: String, 
      enum: ["aadhar", "passport", "driving_license", "other"] 
    },
    idNumber: { 
      type: String 
    },
    status: { 
      type: String, 
      enum: ["active", "inactive"], 
      default: "inactive" 
    },
    address: { 
      type: String 
    },
    note: { 
      type: String 
    },
    assignedRoom: { 
      type: Schema.Types.ObjectId, 
      ref: "Room" 
    }
  },
  { timestamps: true }
);

// optional compound index to ensure a user holds only one active assignment
userSchema.index({ assignedRoom: 1, status: 1 });

export default mongoose.model<IUser>("User", userSchema);
