import {
  Body,
  Delete,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import Container from "typedi";
import { IExtendedRequest, IExtendedResponse } from "../../common/common-types";
import { MenuItemService } from "../menuItem/menuItem.service";
import { CartService } from "./cart.service";
import { CartPayload } from "./dto/cart.dto";
import mongoose from "mongoose";
import { CookieUserValidator } from "../../middleware/cookieUserValidator";
import { RestaurantService } from "../restaurant/restaurant.service";
import { CartItemUpdatePayload } from "./dto/cartItemUpdatePayload.dto";
import { CookieMonsterService } from "../cookieMonster/cookieMonster.service";
import { VATCharge } from "../../config";
import { OrderService } from "../order/order.service";
import { orderAgainPayload } from "./dto/cart.orderAgain.dto";

@JsonController("/cart")
@UseBefore(CookieUserValidator)
export default class CartController {
  protected _cartService: CartService;
  protected _menuItemService: MenuItemService;
  protected _restaurantService: RestaurantService;
  protected _cookieMonsterService: CookieMonsterService;
  protected _orderService: OrderService;

  constructor() {
    this._cartService = Container.get(CartService);
    this._menuItemService = Container.get(MenuItemService);
    this._restaurantService = Container.get(RestaurantService);
    this._cookieMonsterService = Container.get(CookieMonsterService);
    this._orderService = Container.get(OrderService);
  }

  // TO Menu Item into cart.
  @Post("/", { transformRequest: true })
  async AddItemCart(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: CartPayload
  ) {
    try {
      const { quantity, choices, extras, additionalComments, menuItemId } =
          body.payload,
        cookieMonsterId = req.context?.user._id,
        menuItem = await this._menuItemService.findOne(
          { _id: mongoose.Types.ObjectId(menuItemId) },
          {}
        );
      if (!menuItem)
        return res.formatter.error({}, false, "MENU_ITEM_NOT_FOUND!");

      const { name, amount, image, restaurantId, menuCategoryId } = menuItem,
        query = {
          cookieMonsterId: mongoose.Types.ObjectId(cookieMonsterId),
          isOrdered: false,
        },
        restaurantCheck = await this._cartService.find(query, {
          _id: 1,
          restaurantId: 1,
        });
      // Check user is adding items from the same restaurant ot not.
      if (
        restaurantCheck.length > 0 &&
        restaurantCheck[0].restaurantId.toString() !== restaurantId.toString()
      )
        return res.formatter.error(
          {},
          false,
          "ORDER_NOT_ALLOWED_FROM_CROSS_RESTAURANTS"
        );
      // Save Menu Item into Cart.
      const dataTosave = {
          name,
          amount,
          image,
          menuCategoryId,
          quantity,
          choices,
          extras,
          additionalComments,
          restaurantId,
          menuItemId,
          cookieMonsterId,
        },
        item = await this._cartService.save(dataTosave);

      return res.formatter.ok({ item }, true, "MENU_ITEM_ADDED_TO_CART!");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  // To View Cart.
  @Get("/", { transformRequest: true })
  async ViewCart(@Req() req: IExtendedRequest, @Res() res: IExtendedResponse) {
    try {
      const cookieMonsterId = req.context?.user._id,
        cartItems = await this._cartService.find(
          {
            cookieMonsterId: mongoose.Types.ObjectId(cookieMonsterId),
            isOrdered: false,
          },
          {}
        );
      if (cartItems.length === 0)
        return res.formatter.error({}, false, "YOUR_CART_IS_EMPTY!");
      let totalQuantity = 0,
        baseAmount = 0,
        extraAmount = 0,
        totalAmount = 0;
      for (let i = 0; i < cartItems.length; i++) {
        totalQuantity = totalQuantity + cartItems[i].quantity;
        baseAmount = baseAmount + cartItems[i].quantity * cartItems[i].amount;
        for (let j = 0; j < cartItems[i].extras.length; j++) {
          extraAmount =
            extraAmount + cartItems[i].quantity * cartItems[i].extras[j].amount;
        }
      }
      totalAmount = baseAmount + extraAmount;
      const restaurant = await this._restaurantService.findOne(
        { _id: mongoose.Types.ObjectId(cartItems[0].restaurantId) },
        { logo: 1, name: 1, foodType: 1, minOrderValue: 1 },
        {}
      );
      if (!restaurant)
        return res.formatter.error({}, false, "RESTAURANT_NOT_FOUND!");

      return res.formatter.ok(
        { restaurant, cartItems, totalQuantity, totalAmount },
        true,
        "VIEW_CART!"
      );
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  // Update Cart Item
  @Put("/item/:id")
  async EditCartItem(
    @Res() res: IExtendedResponse,
    @Param("id") id: string,
    @Body() body: CartItemUpdatePayload
  ) {
    try {
      const dataToUpdate = body.payload,
        cartItem = await this._cartService.findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(id) },
          { $set: dataToUpdate },
          {
            new: true,
          }
        );
      return res.formatter.ok({ cartItem }, true, "UPDATED_MENU_ITEM!");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  // To Remove particular Menu Item from cart.
  @Delete("/item/:id")
  async DeleteCartItem(@Res() res: IExtendedResponse, @Param("id") id: string) {
    try {
      const item = await this._cartService.findByIdAndDelete(
        { _id: mongoose.Types.ObjectId(id) },
        {}
      );
      if (!item) return res.formatter.error({}, false, "MENU_ITEM_NOT_FOUND");
      return res.formatter.ok({}, true, "REMOVED_MENU_ITEM");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "REMOVE_MENU_ITEM_ERROR",
        err as Error
      );
    }
  }

  // To View Checkout Page.
  @Get("/checkout", { transformRequest: true })
  async CheckoutCart(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse
  ) {
    try {
      const cookieMonsterId = req.context?.user._id,
        cartItems = await this._cartService.find(
          {
            cookieMonsterId: mongoose.Types.ObjectId(cookieMonsterId),
            isOrdered: false,
          },
          {}
        );

      let totalQuantity = 0,
        baseAmount = 0,
        extraAmount = 0,
        totalAmount = 0;
      for (let i = 0; i < cartItems.length; i++) {
        totalQuantity = totalQuantity + cartItems[i].quantity;
        baseAmount = baseAmount + cartItems[i].quantity * cartItems[i].amount;
        for (let j = 0; j < cartItems[i].extras.length; j++) {
          extraAmount =
            extraAmount + cartItems[i].quantity * cartItems[i].extras[j].amount;
        }
      }
      const restaurant = await this._restaurantService.findOne(
        { _id: mongoose.Types.ObjectId(cartItems[0].restaurantId) },
        { name: 1, deliveryType: 1, deliveryCharge: 1 },
        {}
      );
      if (!restaurant)
        return res.formatter.error({}, false, "RESTAURANT_NOT_FOUND!");
      const cookieMonsterAddress = await this._cookieMonsterService.findOne(
        { _id: mongoose.Types.ObjectId(cookieMonsterId) },
        { address: 1 }
      );
      if (!cookieMonsterAddress)
        return res.formatter.error({}, false, "USER_NOT_FOUND!");
      const defaultAddress = cookieMonsterAddress.address.filter(
        (item) => item.isDefault === true
      );
      totalAmount = baseAmount + extraAmount;
      const payWtih = ["Debit/Credit Card", "Takein Wallet", "Cash"],
        deliveryCharge = restaurant.deliveryCharge,
        payableAmount = totalAmount + deliveryCharge + VATCharge;
      return res.formatter.ok(
        {
          cartItems,
          restaurant,
          defaultAddress,
          payWtih,
          totalAmount,
          deliveryCharge,
          VATCharge,
          payableAmount,
        },
        true,
        "VIEW_CART_CHECKOUT!"
      );
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  // To Order Again.
  @Post("/order-again", { transformRequest: true })
  @UseBefore(CookieUserValidator)
  async AddOrderAgain(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: orderAgainPayload
  ) {
    try {
      const { orderId } = body.payload;
      const cookieMonsterId = req.context?.user._id,
        orderAgain = await this._orderService.findOne(
          { _id: mongoose.Types.ObjectId(orderId) },
          {}
        );
      if (!orderAgain)
        return res.formatter.error({}, false, "PREVIOUS_ORDER_NOT_FOUND!");
      let name,
        amount,
        image,
        restaurantId,
        menuCategoryId,
        quantity,
        choices,
        additionalComments,
        menuItemId,
        extras,
        menuItem;
      for (let i = 0; i < orderAgain.cartItems.length; i++) {
        quantity = orderAgain.cartItems[i].quantity;
        choices = orderAgain.cartItems[i].choices;
        additionalComments = orderAgain.cartItems[i].additionalComments;
        menuItemId = orderAgain.cartItems[i].menuItemId;
        extras = orderAgain.cartItems[i].extras;
        menuItem = await this._menuItemService.findOne(
          { _id: mongoose.Types.ObjectId(orderAgain.cartItems[i].menuItemId) },
          {}
        );
        name = menuItem?.name;
        amount = menuItem?.amount;
        image = menuItem?.image;
        restaurantId = menuItem?.restaurantId;
        menuCategoryId = menuItem?.menuCategoryId;
        const dataTosave = {
          name,
          amount,
          image,
          menuCategoryId,
          quantity,
          choices,
          extras,
          additionalComments,
          restaurantId,
          menuItemId,
          cookieMonsterId,
        };
        await this._cartService.save(dataTosave);
      }

      return res.formatter.ok({}, true, "MENU_ITEM_ADDED_TO_CART!");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }
}

