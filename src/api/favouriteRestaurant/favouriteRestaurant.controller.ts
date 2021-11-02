import {
  Body,
  JsonController,
  Post,
  Res,
  Req,
  Delete,
  Param,
  Get,
  UseBefore,
} from "routing-controllers";
import Container from "typedi";
import { IExtendedRequest, IExtendedResponse } from "../../common/common-types";
import { FavouriteRestaurantService } from "./favouriteRestaurant.service";
import { FavouriteRestaurantPayload } from "./dto/favouriteRestaurant.dto";
import mongoose from "mongoose";
import { CookieUserValidator } from "../../middleware/cookieUserValidator";

@JsonController("/favourite/restaurant")
@UseBefore(CookieUserValidator)
export default class FavourireRestaurantController {
  protected _favouriteRestaurantService: FavouriteRestaurantService;

  constructor() {
    this._favouriteRestaurantService = Container.get(
      FavouriteRestaurantService
    );
  }

  // To Add Restaurant into Favourite List
  @Post("/", { transformRequest: true })
  async AddFavouriteRestaurant(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: FavouriteRestaurantPayload
  ) {
    try {
      const { restaurantId } = body.payload,
        cookieMonsterId = req.context?.user._id,
        item = {
          cookieMonsterId,
          restaurantId,
        },
        query = {
          restaurantId: mongoose.Types.ObjectId(restaurantId),
          cookieMonsterId: mongoose.Types.ObjectId(cookieMonsterId),
        },
        restaurant = await this._favouriteRestaurantService.findOne(query, {});

      if (restaurant)
        return res.formatter.error({}, false, "RESTAURANT_ALREADY_FAVORITED");

      const favourireRestaurant = await this._favouriteRestaurantService.save(
        item
      );
      return res.formatter.ok(
        favourireRestaurant,
        true,
        "RESTAURANT_ADDED_INTO_FAVOURITE_LIST!"
      );
    } catch (err) {
      return res.formatter.error(
        null,
        false,
        "ADD_FAVOURITE_ERROR",
        new Error("Error!")
      );
    }
  }

  // To fetch list of favourite Restaurants per user.
  @Get("/", { transformRequest: true })
  async ListFavouriteRestaurant(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse
  ) {
    try {
      const cookieMonsterId = req.context?.user._id,
        favouriteRestaurant = await this._favouriteRestaurantService.find(
          { cookieMonsterId: mongoose.Types.ObjectId(cookieMonsterId) },
          {}
        );

      return res.formatter.ok(
        { favouriteRestaurant },
        true,
        "FAVOURITED_RESTAURANT_LIST"
      );
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  // To Delete/Remove Restaurant from Favourite List.
  @Delete("/:id")
  async DeleteFavouriteRestaurant(
    @Res() res: IExtendedResponse,
    @Param("id") id: string
  ) {
    try {
      const restaurant =
        await this._favouriteRestaurantService.findByIdAndDelete(
          { _id: mongoose.Types.ObjectId(id) },
          {}
        );
      if (!restaurant)
        return res.formatter.error({}, false, "RESTAURANT_NOT_FOUND");
      return res.formatter.ok(
        { restaurant },
        true,
        "REMOVED_FROM_FAVOURITE_LIST"
      );
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }
}
