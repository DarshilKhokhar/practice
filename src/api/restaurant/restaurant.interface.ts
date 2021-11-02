import { Document } from "mongoose";
import { IMealType } from "../mealType/mealType.interface";

export interface IRestaurant extends Document {
  name: string;
  logo: string;
  bannerImage: [string];
  foodType: [string];
  phoneNumber: number;
  minOrderValue: number;
  maxOrderValue: number;
  openingTime: string;
  closingTime: string;
  deliveryTime: string;
  lastOrderTime: string;
  deliveryType: [string];
  deliveryCharge: number;
  offeredMealType: IMealType["_id"];
  avgRatings: number;
  totalReviews: number;
  isActive: number;
  offer: {
    offerType: string;
    isActive: boolean;
    discount: number;
    startDate: string;
    endDate: string;
    description: string;
    bannerImage: string;
  };
  address: {
    country: string;
    state: string;
    city: string;
    postalCode: number;
    street: string;
    location: {
      type: string;
      coordinates: number[];
    };
  };
}
