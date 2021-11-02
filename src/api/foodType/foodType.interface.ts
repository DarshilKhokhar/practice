import { Document } from "mongoose";

export interface IFoodType extends Document {
  foodType: string;
}