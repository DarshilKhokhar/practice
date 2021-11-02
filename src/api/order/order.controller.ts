import {
  Body,
  BodyParam,
  Get,
  JsonController,
  Param,
  Post,
  Put,
  QueryParam,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import Container from "typedi";
import { IExtendedRequest, IExtendedResponse } from "../../common/common-types";
import { OrderService } from "./order.service";
import { OrderPayload } from "./dto/order.dto";
import mongoose from "mongoose";
import { CookieUserValidator } from "../../middleware/cookieUserValidator";
import { CartService } from "../cart/cart.service";
import { RestaurantService } from "../restaurant/restaurant.service";
import { CookieMonsterService } from "../cookieMonster/cookieMonster.service";
import { VATCharge } from "../../config";
import { CookieMakerValidator } from "../../middleware/cookieMakerValidator";
import { NotificationService } from "../notification/notification.service";
import { MenuItemService } from "../menuItem/menuItem.service";

@JsonController("")
export default class OrderController {
  protected _orderService: OrderService;
  protected _cartService: CartService;
  protected _restaurantService: RestaurantService;
  protected _menuItemService: MenuItemService;
  protected _cookieMonsterService: CookieMonsterService;
  protected _notificationService: NotificationService;

  constructor() {
    this._orderService = Container.get(OrderService);
    this._cartService = Container.get(CartService);
    this._menuItemService = Container.get(MenuItemService);
    this._restaurantService = Container.get(RestaurantService);
    this._cookieMonsterService = Container.get(CookieMonsterService);
    this._notificationService = Container.get(NotificationService);
  }

  // To Make Order.
  @Post("/order", { transformRequest: true })
  @UseBefore(CookieUserValidator)
  async AddOrder(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: OrderPayload
  ) {
    try {
      const { deliveryType, payWith } = body.payload,
        cookieMonsterId = req.context?.user._id,
        cartItems = await this._cartService.find(
          {
            cookieMonsterId: mongoose.Types.ObjectId(cookieMonsterId),
            isOrdered: false,
          },
          {}
        );
      if (cartItems.length === 0)
        return res.formatter.error({}, false, "YOUR_CART_IS_EMPTY!");
      const restaurant = await this._restaurantService.findOne(
          { _id: mongoose.Types.ObjectId(cartItems[0].restaurantId) },
          { name: 1, deliveryCharge: 1, minOrderValue: 1 },
          {}
        ),
        restaurantId = restaurant?._id;
      if (!restaurant)
        return res.formatter.error({}, false, "RESTAURANT_NOT_FOUND!");
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
      let orderId = Date.now().toString(); // '1492341545873'
      // pad with Preffix and extra random digit
      orderId = "#TK_" + orderId + Math.floor(Math.random() * 10);
      totalAmount = baseAmount + extraAmount;
      const deliveryCharge = restaurant.deliveryCharge,
        payableAmount = totalAmount + deliveryCharge + VATCharge,
        item = {
          restaurantId,
          cookieMonsterId,
          cartItems,
          deliveryType,
          payWith,
          orderDate: new Date(Date.now()),
          orderId,
          totalAmount,
          deliveryCharge,
          VATCharge,
          payableAmount,
        };

      await this._orderService.save(item);
      for (let i = 0; i < cartItems.length; i++) {
        let menuItemId = cartItems[i].menuItemId;
        await this._menuItemService.findByIdAndUpdate(
          {_id: mongoose.Types.ObjectId(menuItemId)},
          {
            $inc: {
              soldCount: 1
            },
          }
        );
      }
      for (let i = 0; i < cartItems.length; i++) {
        let _id = cartItems[i]._id;
        await this._cartService.findByIdAndDelete(
          { _id: mongoose.Types.ObjectId(_id) },
          {}
        );
      }
      const data = {
        message: `New Order ${orderId} has been placed`,
        restaurantId,
      };
      await this._notificationService.save(data);
      return res.formatter.ok({ orderId }, true, "ORDER_SUCCESSFULLY_PLACED!");
    } catch (err) {
      return res.formatter.error(
        null,
        false,
        "ORDER_UNSUCCESSFUL",
        new Error("Error!")
      );
    }
  }

  // To View Orders.
  @Get("/order", { transformRequest: true })
  @UseBefore(CookieUserValidator)
  async ViewOrder(@Req() req: IExtendedRequest, @Res() res: IExtendedResponse) {
    try {
      const cookieMonsterId = req.context?.user._id;
      const pipeLine = [
          {
            $match: {
              cookieMonsterId: mongoose.Types.ObjectId(cookieMonsterId),
            },
          },
          {
            $lookup: {
              from: "restaurants",
              localField: "restaurantId",
              foreignField: "_id",
              as: "restaurants",
            },
          },
          {
            $project: {
              restaurants: { logo: 1, name: 1, address: 1 },
              payableAmount: 1,
              orderDate: 1,
              "cartItems.quantity": 1,
              "cartItems.name": 1,
            },
          },
        ],
        orders = await this._orderService.aggregate(pipeLine);
      if (orders.length === 0)
        return res.formatter.error({}, false, "PREVIOUS_ORDERS_NOT_FOUND!");
      return res.formatter.ok(orders, true, "ORDERS!");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  // View List for Cookie Maker.
  @Get("/cookie-maker/order/list", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async CookieMakerViewOrder(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @QueryParam("status") orderStatus: string
  ) {
    try {
      const restaurantId = req.context?.user.restaurantId;
      let query: { [key: string]: any } = {
        restaurantId: restaurantId,
      };
      if (orderStatus) {
        query = {
          restaurantId: restaurantId,
          orderStatus: orderStatus,
        };
      }
      const projection = {
          orderId: 1,
          orderStatus: 1,
          "cartItems.image": 1,
          "cartItems.name": 1,
          "cartItems.amount": 1,
          "cartItems.quantity": 1,
          payableAmount: 1,
        },
        orders = await this._orderService.find(query, projection);
      if (orders.length === 0)
        return res.formatter.error({}, false, "ORDERS_NOT_FOUND!");
      return res.formatter.ok({ orders }, true, "ORDERS!");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  //To Get Orders Summary
  @Get("/cookie-maker/orders-summary", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async CookieMakerOrdersSummary(
    @Res() res: IExtendedResponse,
    @Req() req: IExtendedRequest
  ) {
    try {
      const restaurantId = req.context?.user.restaurantId;

      let query: { [key: string]: any } = {
        restaurantId: restaurantId,
      };

      const projection = {
        orderStatus: 1,
        payableAmount: 1,
      };

      const orders = await this._orderService.find(query, projection);

      let totalSales = 0,
        OnDelivery = 0,
        Delivered = 0,
        Reservations = 0,
        Canceled = 0,
        Accepted = 0,
        Waiting = 0;
      for (let i = 0; i < orders.length; i++) {
        if (orders[i].orderStatus === "OnDelivery") {
          OnDelivery++;
        }

        if (orders[i].orderStatus === "Delivered") {
          Delivered++;
          totalSales = totalSales + orders[i].payableAmount;
        }

        if (orders[i].orderStatus === "Reservations") {
          Reservations++;
        }

        if (orders[i].orderStatus === "Canceled") {
          Canceled++;
        }

        if (orders[i].orderStatus === "Accepted") {
          Accepted++;
        }

        if (orders[i].orderStatus === "Waiting") {
          Waiting++;
        }
      }

      const OrdersSummary = {
        totalSales,
        OnDelivery,
        Delivered,
        Reservations,
        Canceled,
        Accepted,
        Waiting,
      };

      return res.formatter.ok({ OrdersSummary }, true, "ORDERS!");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  // TO Update Order Status.
  @Put("/cookie-maker/order/:id")
  @UseBefore(CookieMakerValidator)
  async EditOrderStatus(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Param("id") id: string,
    @BodyParam("orderStatus") orderStatus: string
  ) {
    try {
      const restaurantId = req.context?.user.restaurantId,
        order = await this._orderService.findByIdAndUpdate(
          { _id: mongoose.Types.ObjectId(id) },
          { $set: { orderStatus: orderStatus } },
          {
            new: true,
          }
        );

      if (!order) return res.formatter.error({}, false, "ORDER_NOT_FOUND");

      const data = {
        message: `Order ${order.orderId} has been ${orderStatus}`,
        restaurantId,
      };
      await this._notificationService.save(data);

      return res.formatter.ok(
        { orderStatus: order.orderStatus },
        true,
        "UPDATED_ORDER_STATUS"
      );
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "ORDER_STATUS_UPDATE_ERROR",
        err as Error
      );
    }
  }

  // To Get details of particular Order.
  @Get("/cookie-maker/order/:id", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async CookieMakerOrderDetails(
    @Res() res: IExtendedResponse,
    @Param("id") id: string
  ) {
    try {
      const projection = {
          orderStatus: 1,
          cartItems: 1,
          deliveryType: 1,
          orderId: 1,
          payableAmount: 1,
          cookieMonsterId: 1,
        },
        orderDetails = await this._orderService.findOne(
          { _id: mongoose.Types.ObjectId(id) },
          projection
        );

      if (!orderDetails)
        return res.formatter.error({}, false, "ORDER_NOT_FOUND");

      const cookieMonsterProjection = {
          firstName: 1,
          lastName: 1,
          mobileNumber: 1,
          address: { $elemMatch: { isDefault: true } },
        },
        cookieMonsterId = orderDetails?.cookieMonsterId,
        userDetails = await this._cookieMonsterService.findOne(
          { _id: mongoose.Types.ObjectId(cookieMonsterId) },
          cookieMonsterProjection,
          {
            lean: true,
          }
        );

      return res.formatter.ok(
        { userDetails, orderDetails },
        true,
        "ORDER_DETAILS!"
      );
    } catch (err) {
      return res.formatter.error({}, false, "ORDER_ITEM_ERROR", err as Error);
    }
  }

  // To Get details of particular Order.
  @Get("/order/:id", { transformRequest: true })
  @UseBefore(CookieUserValidator)
  async orderDetails(@Res() res: IExtendedResponse, @Param("id") id: string) {
    try {
      const orderItem = await this._orderService.find(
        { _id: mongoose.Types.ObjectId(id) },
        {}
      );

      return res.formatter.ok({ orderItem }, true, "ORDER_ITEM!");
    } catch (err) {
      return res.formatter.error({}, false, "ORDER_ITEM_ERROR", err as Error);
    }
  }
}
