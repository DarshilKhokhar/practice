import { Document } from "mongoose";
import { ICookieMonster } from "../cookieMonster/cookieMonster.interface";
import { IRestaurant } from "../restaurant/restaurant.interface";

export interface IFavouriteRestaurant extends Document {
  cookieMonsterId: ICookieMonster["_id"];
  restaurantId: IRestaurant["_id"];
}
