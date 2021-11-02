import { Document } from "mongoose";
import { ICookieMonster } from "../cookieMonster/cookieMonster.interface";
import { IRestaurant } from "../restaurant/restaurant.interface";

export interface IReview extends Document {
    cookieMonsterId: ICookieMonster["_id"];
    restaurantId: IRestaurant["_id"];
    rating: number;
    reviewComment: string;
    reviewDate: number;
}