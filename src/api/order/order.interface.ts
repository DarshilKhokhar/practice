import { Document } from "mongoose";
import { ICookieMonster } from "../cookieMonster/cookieMonster.interface";
import { IMenuCategory } from "../menuCategory/menuCategory.interface";
import { IMenuItem } from "../menuItem/menuItem.interface";
import { IRestaurant } from "../restaurant/restaurant.interface";

export interface IOrder extends Document {
  restaurantId: IRestaurant["_id"];
  cookieMonsterId: ICookieMonster["_id"];
  deliveryType: string;
  payWith: string;
  totalAmount: number;
  deliveryCharge: number;
  VATCharge: number;
  payableAmount: number;
  orderDate: number;
  orderId: string;
  orderStatus: string;
  cartItems: [
    {
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
      menuCategoryId: IMenuCategory["_id"];
      additionalComments: string;
      menuItemId: IMenuItem["_id"];
    }
  ];
}
