import { Document } from "mongoose";
import { IRestaurant } from "../restaurant/restaurant.interface";

export interface INotification extends Document {
  message: string;
  date: number;
  isUnread: boolean;
  restaurantId: IRestaurant["_id"];
}