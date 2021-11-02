import { Document } from "mongoose";

export interface IContactUs extends Document {
  name: string;
  phoneNumber: number;
  email: string;
  message: string;
}
