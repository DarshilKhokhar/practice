import { Document } from "mongoose";

export interface ISearch extends Document {
  value: string;
  type: string;
}