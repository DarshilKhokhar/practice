import { Body, Delete, Get, JsonController, Param, Post, Res } from "routing-controllers";
import Container from "typedi";
import { IExtendedResponse } from "../../common/common-types";
import { FoodTypeService } from "./foodType.service";
import { FoodTypePayload } from "./dto/foodType.dto";
import mongoose from "mongoose";

@JsonController("/food-type")
export default class FoodTypeController {
  protected _foodPreferenceService: FoodTypeService;

  constructor() {
    this._foodPreferenceService = Container.get(FoodTypeService);
  }

  // TO add Food Type
  @Post("/", { transformRequest: true })
  async AddFoodType(
    @Res() res: IExtendedResponse,
    @Body() body: FoodTypePayload
  ) {
    try {
      const { foodType } = body.payload;

      // check if the Food type is already exists or not
      const query = {
        foodType,
        },
        meal = await this._foodPreferenceService.findOne(query, { _id: 1 });
      if (meal)
        return res.formatter.error({}, false, "FOOD_TYPE_ALREADY_EXISTS");

      // Save Food type in the DB
      const dataTosave = {
        foodType,
      };

      await this._foodPreferenceService.save(dataTosave);

      return res.formatter.ok({}, true, "FOOD_TYPE_SAVED");
    } catch (err) {
      return res.formatter.error({}, false, "FOOD_TYPE_ADD_FAILURE", err as Error);
    }
  }

  // TO get list of food types.
  @Get("/", { transformRequest: true })
  async GetFoodType(@Res() res: IExtendedResponse) {
    try {
      const data = await this._foodPreferenceService.find({}, {}, {});

      return res.formatter.ok({ data }, true, "GET_FOOD_TYPE");
    } catch (err) {
      return res.formatter.error({}, false,"GET_FOOD_TYPE_ERROR",  err as Error);
    }
  }

  // To Delete particular Meal type
  @Delete("/:id")
  async DeleteMenuItem(@Res() res: IExtendedResponse, @Param("id") id: string) {
    try {
      const foodType = await this._foodPreferenceService.findByIdAndDelete(
        { _id: mongoose.Types.ObjectId(id) },
        {}
      );
      if (!foodType) return res.formatter.error({}, false, "ITEM_NOT_FOUND!");
      return res.formatter.ok({}, true, "DELETED_FOOD_TYPE");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }
}
