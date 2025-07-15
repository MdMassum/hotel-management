import type { IRoom } from "./roomInterface";

export interface IUser {
    _id:string;
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
    assignedRoom?: IRoom;
  }