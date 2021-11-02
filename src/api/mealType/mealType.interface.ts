import { Document } from "mongoose";

export interface IMealType extends Document {
  mealType: string;
  image: string;
  selectedImage: string;
}
