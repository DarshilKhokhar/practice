import * as mongoose from "mongoose";
import { IFavouriteRestaurant } from "./favouriteRestaurant.interface";

const favouriteRestaurantSchema: mongoose.Schema<IFavouriteRestaurant> =
  new mongoose.Schema(
    {
      cookieMonsterId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "cookieMonster",
      },
      restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "restaurant",
      },
    },
    {
      timestamps: true,
    }
  );

favouriteRestaurantSchema.index({ resturantId: 1 });
const favouriteRestaurantModel = mongoose.model<IFavouriteRestaurant>(
  "favouriteRestaurant",
  favouriteRestaurantSchema
);
favouriteRestaurantModel.ensureIndexes();

export default favouriteRestaurantModel;
