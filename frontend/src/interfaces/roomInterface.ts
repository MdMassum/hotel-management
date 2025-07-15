import type { IProperty } from "./propertyInterface";
import type { IUser } from "./userInterface";

export interface IRoom extends Document {
    _id:string,
    propertyId: IProperty;
    roomNumber: string;
    type: "single" | "double" | "deluxe";
    daily_rent: number;
    monthly_rent: number;
    yearly_rent: number;
    status: "available" | "booked";
    assignedTo?: IUser;
  }