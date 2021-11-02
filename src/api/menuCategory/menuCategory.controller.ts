import {
  Body,
  JsonController,
  Post,
  Res,
  Req,
  Get,
  Param,
  Delete,
  UseBefore,
  QueryParam,
} from "routing-controllers";
import Container from "typedi";
import { IExtendedRequest, IExtendedResponse } from "../../common/common-types";
import { MenuCategoryService } from "./menuCategory.service";
import { MenuCategoryPayload } from "./dto/menuCategory.dto";
import mongoose from "mongoose";
import { CookieMakerValidator } from "../../middleware/cookieMakerValidator";

@JsonController("")
export default class MenuCategoryController {
  protected _menuCategoryService: MenuCategoryService;

  constructor() {
    this._menuCategoryService = Container.get(MenuCategoryService);
  }

  // To add Menu Category.
  @Post("/cookie-maker/menu/category", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async createMenuCategory(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: MenuCategoryPayload
  ) {
    try {
      const { categoryName } = body.payload,
        restaurantId = req.context?.user.restaurantId,
        item = {
          categoryName,
          restaurantId,
        },
        category = await this._menuCategoryService.save(item);
      return res.formatter.ok(category, true, "CREATED_MENU_CAREGORY");
    } catch (err) {
      return res.formatter.error(
        null,
        false,
        "CREATE_MENU_CATEGORY_ERROR",
        new Error("Error!")
      );
    }
  }

  // TO get list Menu category For Cookie Maker.
  @Get("/cookie-maker/menu/category", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async CookieMakerListMenuCategory(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse
  ) {
    try {
      const restaurantId = req.context?.user.restaurantId,
        category = await this._menuCategoryService.find(
          { restaurantId },
          { categoryName: 1 }
        );

      return res.formatter.ok({ category }, true, "LIST_MENU_CATEGORY");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "LIST_MENU_CATEGORY_ERROR",
        err as Error
      );
    }
  }

  // TO get list Menu category For Cookie Monster.
  @Get("/menu/category", { transformRequest: true })
  async ListMenuCategory(
    @Res() res: IExtendedResponse,
    @QueryParam("restaurantId") restaurantId: string
  ) {
    try {
      const category = await this._menuCategoryService.find(
        { restaurantId },
        { categoryName: 1 }
      );

      return res.formatter.ok({ category }, true, "LIST_MENU_CATEGORY");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "LIST_MENU_CATEGORY_ERROR",
        err as Error
      );
    }
  }

  // To Delete particular Menu category.
  @Delete("/cookie-maker/menu/category/:id")
  @UseBefore(CookieMakerValidator)
  async DeleteMenuCategory(
    @Res() res: IExtendedResponse,
    @Param("id") id: string
  ) {
    try {
      const menuCategory = await this._menuCategoryService.findByIdAndDelete(
        { _id: mongoose.Types.ObjectId(id) },
        {}
      );
      if (!menuCategory)
        return res.formatter.error({}, false, "MENU_CATEGORY_NOT_FOUND");
      return res.formatter.ok({}, true, "DELETED_MENU_CATEGORY");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "DELETE_MENU_CATEGORY_ERROR",
        err as Error
      );
    }
  }
}
