import { Document } from "mongoose";
import { IRestaurant } from "../restaurant/restaurant.interface";

export interface ICookieMaker extends Document {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  accountStatus: string;
  token: string;
  lastLoginTime: number;
  tokenCreatedTime: number;
  restaurantId: IRestaurant["_id"];
}
