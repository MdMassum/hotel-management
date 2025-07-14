import type { IUser } from "./userInterface";

export interface IProperty {
    _id: number;
    name: string;
    location: string;
    description: string;
    createdBy: IUser;
  };