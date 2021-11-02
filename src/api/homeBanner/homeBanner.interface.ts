import { Document } from "mongoose";

export interface IHomeBanner extends Document {
  title: string;
  description: string;
  backgroundImage: string;
  keyword: string;
}
