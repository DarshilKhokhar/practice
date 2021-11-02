import { Document } from "mongoose";
import { ICookieMonster } from "../cookieMonster/cookieMonster.interface";
import { IMenuCategory } from "../menuCategory/menuCategory.interface";
import { IMenuItem } from "../menuItem/menuItem.interface";
import { IRestaurant } from "../restaurant/restaurant.interface";

export interface ICart extends Document {
  name: string;
  quantity: number;
  amount: number;
  image: string;
  choices: [string];
  extras: [
    {
      name: string;
      calories: number;
      amount: number;
    }
  ];
  additionalComments: string;
  isOrdered: boolean;
  menuCategoryId: IMenuCategory["_id"];
  restaurantId: IRestaurant["_id"];
  menuItemId: IMenuItem["_id"];
  cookieMonsterId: ICookieMonster["_id"];
}
