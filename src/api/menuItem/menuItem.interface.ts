import { Document } from "mongoose";
import { IMenuCategory } from "../menuCategory/menuCategory.interface";
import { IRestaurant } from "../restaurant/restaurant.interface";

export interface IMenuItem extends Document {
  name: string;
  calories: number;
  description: string;
  amount: number;
  image: string;
  isAvailable: boolean;
  itemCount: number;
  soldCount: number;
  itemDetails: {
    choices: [string];
    extras: [
      {
        name: string;
        calories: number;
        amount: number;
      }
    ];
  };
  menuCategoryId: IMenuCategory["_id"];
  restaurantId: IRestaurant["_id"];
}
