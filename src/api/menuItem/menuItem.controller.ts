import {
  Body,
  JsonController,
  Post,
  Res,
  Req,
  Get,
  Param,
  Delete,
  QueryParams,
  UseBefore,
  Put,
} from "routing-controllers";
import Container from "typedi";
import { IExtendedRequest, IExtendedResponse } from "../../common/common-types";
import { MenuItemService } from "./menuItem.service";
import { MenuItemPayload } from "./dto/menuItem.dto";
import mongoose from "mongoose";
import { MenuItemParams } from "./dto/MenuItemParams.dto";
import { CookieMakerValidator } from "../../middleware/cookieMakerValidator";
import { MenuItemUpdatePayload } from "./dto/menuItemUpdate.dto";

@JsonController("")
export default class MenuItemController {
  protected _menuItemService: MenuItemService;

  constructor() {
    this._menuItemService = Container.get(MenuItemService);
  }

  // To Add Menu items
  @Post("/cookie-maker/menu/item", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async createMenuItem(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: MenuItemPayload
  ) {
    try {
      const {
          name,
          calories,
          description,
          amount,
          image,
          itemDetails,
          menuCategoryId,
        } = body.payload,
        restaurantId = req.context?.user.restaurantId,
        item = {
          name,
          calories,
          description,
          amount,
          image,
          itemDetails,
          menuCategoryId,
          restaurantId,
        };
      const category = await this._menuItemService.save(item);
      return res.formatter.ok(category, true, "ADDED_MENU_ITEM!");
    } catch (err) {
      return res.formatter.error(
        null,
        false,
        "ADD_MENU_ITEM_ERROR",
        new Error("Error!")
      );
    }
  }

  // To fetch list of Menu Items based on Menu category and restaurant.
  @Get("/menu/item", { transformRequest: true })
  async ListMenuItem(
    @Res() res: IExtendedResponse,
    @QueryParams() params: MenuItemParams
  ) {
    try {
      const projection = {
        name: 1,
        calories: 1,
        description: 1,
        amount: 1,
        image: 1,
      };
      let query: { [key: string]: any } = {
        restaurantId: params.restaurantId,
        isAvailable: true
      };
      if (params.menuCategoryId) {
        query = {
          $and: [
            { restaurantId: params.restaurantId },
            { menuCategoryId: params.menuCategoryId },
            { isAvailable: true }
          ],
        };
      }
      if (params.search) {
        query = {
          name: { $regex: params.search, $options: "i" },
          restaurantId: params.restaurantId,
          isAvailable: true
        };
      }
      const menuItems = await this._menuItemService.find(query, projection);

      return res.formatter.ok({ menuItems }, true, "LIST_MENU_ITEM");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "LIST_MENU_ITEM_ERROR",
        err as Error
      );
    }
  }

  // To fetch list of Menu Items based on Menu category and restaurant.
  @Get("/cookie-maker/menu/item", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async CookieMakerListMenuItem(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @QueryParams() params: MenuItemParams
  ) {
    try {
      const projection = {
          name: 1,
          description: 1,
          amount: 1,
          image: 1,
          isAvailable: 1,
        },
        restaurantId = req.context?.user.restaurantId;
      let query: { [key: string]: any } = {};
      if (params.menuCategoryId) {
        query = {
          $and: [
            { restaurantId: restaurantId },
            { menuCategoryId: params.menuCategoryId },
          ],
        };
      }
      const menuItems = await this._menuItemService.find(query, projection);

      return res.formatter.ok({ menuItems }, true, "LIST_MENU_ITEM");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "LIST_MENU_ITEM_ERROR",
        err as Error
      );
    }
  }

  // To Fetch Most Popular Menu Itesm
  @Get("/cookie-maker/menu/item/popular", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async MostPopularMenuItem(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
  ) {
    try {
      const projection = {
          name: 1,
          amount: 1,
          image: 1,
          soldCount: 1,
          menuCategoryId: 1
        },
        restaurantId = req.context?.user.restaurantId,
        query ={
          restaurantId: restaurantId
        },
        QueryOptions = { lean: true, sort: { soldCount: -1 }, limit: 5, populate: "menuCategoryId" },
      menuItems = await this._menuItemService.findPopular(query, projection, QueryOptions );

      return res.formatter.ok({ menuItems }, true, "LIST_MENU_ITEM");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "LIST_MENU_ITEM_ERROR",
        err as Error
      );
    }
  }

  // TO Update restaurant Details.
  @Put("/cookie-maker/menu/item/:id")
  @UseBefore(CookieMakerValidator)
  async EditMenuItem(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Param("id") id: string,
    @Body() body: MenuItemUpdatePayload
  ) {
    try {
      const {
          name,
          calories,
          description,
          amount,
          isAvailable,
          image,
          itemDetails,
          menuCategoryId,
        } = body.payload,
        menuItem = await this._menuItemService.findByIdAndUpdate(
          {_id: mongoose.Types.ObjectId(id)},
          {
            $set: {
              name,
              calories,
              description,
              amount,
              isAvailable,
              image,
              menuCategoryId,
            },
            $push: itemDetails,
          }
        );
      if (!menuItem)
        return res.formatter.error({}, false, "MENU_ITEM_NOT_FOUND");
      return res.formatter.ok({ menuItem }, true, "UPDATE_MENU_ITEM_DATA");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "UPDATE_MENU_ITEM_DATA_ERROR",
        err as Error
      );
    }
  }

  // To Get details of particular Menu Items.
  @Get("/menu/item/:id", { transformRequest: true })
  async MenuItem(@Res() res: IExtendedResponse, @Param("id") id: string) {
    try {
      const projection = {
          image: 1,
          name: 1,
          description: 1,
          calories: 1,
          itemCount: 1,
          amount: 1,
          itemDetails: 1,
        },
        menuItem = await this._menuItemService.find(
          { _id: mongoose.Types.ObjectId(id) },
          projection
        );

      return res.formatter.ok({ menuItem }, true, "MENU_ITEM_DETAILS");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "MENU_ITEM_DETAILS_ERROR",
        err as Error
      );
    }
  }

  // To Delete particular Menu Item.
  @Delete("/cookie-maker/menu/item/:id")
  @UseBefore(CookieMakerValidator)
  async DeleteMenuItem(@Res() res: IExtendedResponse, @Param("id") id: string) {
    try {
      const menuItem = await this._menuItemService.findByIdAndDelete(
        {_id: mongoose.Types.ObjectId(id)},
        {}
      );
      if (!menuItem)
        return res.formatter.error({}, false, "MENU_ITEM_NOT_FOUND");
      return res.formatter.ok({}, true, "DELETED_MENU_ITEM");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "DELETE_MENU_ITEM_ERROR",
        err as Error
      );
    }
  }
}
