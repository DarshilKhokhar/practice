import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Res,
} from "routing-controllers";
import Container from "typedi";
import { IExtendedResponse } from "../../common/common-types";
import { MealTypeService } from "./mealType.service";
import { MealTypePayload } from "./dto/mealType.dto";
import mongoose from "mongoose";

@JsonController("/meal-type")
export default class MealTypeController {
  protected _mealTypeService: MealTypeService;

  constructor() {
    this._mealTypeService = Container.get(MealTypeService);
  }

  // To add Meal Type..
  @Post("/", { transformRequest: true })
  async AddMealType(
    @Res() res: IExtendedResponse,
    @Body() body: MealTypePayload
  ) {
    try {
      const { mealType, image, selectedImage } = body.payload;

      // check if the meal type is already exists or not
      const query = {
          mealType
        },
        meal = await this._mealTypeService.findOne(query, { _id: 1 });
      if (meal)
        return res.formatter.error({}, false, "MEAL_TYPE_ALREADY_EXISTS");

      // Save meal type in the DB
      const dataTosave = {
        mealType,
        image,
        selectedImage
      };

      await this._mealTypeService.save(dataTosave);

      return res.formatter.ok({}, true, "MEAL_TYPE_SAVED");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "MEAL_TYPE_ADD_FAILURE",
        err as Error
      );
    }
  }

  // To get list of Meal Types.
  @Get("/", { transformRequest: true })
  async GetMealType(@Res() res: IExtendedResponse) {
    try {
      const data = await this._mealTypeService.find({}, {}, {});

      return res.formatter.ok({ data }, true, "GET_MEAL_TYPE");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "GET_MEAL_TYPE_ERROR",
        err as Error
      );
    }
  }

  // To Delete particular Meal Type
  @Delete("/:id")
  async DeleteMenuItem(@Res() res: IExtendedResponse, @Param("id") id: string) {
    try {
      const mealType = await this._mealTypeService.findByIdAndDelete(
        { _id: mongoose.Types.ObjectId(id) },
        {}
      );
      if (!mealType) return res.formatter.error({}, false, "ITEM_NOT_FOUND!");
      return res.formatter.ok({}, true, "DELETED_MEAL_TYPE");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }
}
