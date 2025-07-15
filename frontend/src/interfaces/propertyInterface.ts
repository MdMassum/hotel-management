import type { IUser } from "./userInterface";

export interface IProperty {
    _id: string;
    name: string;
    location: string;
    description: string;
    createdBy: IUser;
  };