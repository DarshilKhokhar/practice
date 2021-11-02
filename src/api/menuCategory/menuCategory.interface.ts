import { Document } from "mongoose";
import { IRestaurant } from "../restaurant/restaurant.interface";

export interface IMenuCategory extends Document {
  categoryName: string;
  restaurantId: IRestaurant["_id"];
}
