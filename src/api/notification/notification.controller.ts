import {
  Body,
  BodyParam,
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
import { NotificationService } from "./notification.service";
import mongoose from "mongoose";
import { CookieMakerValidator } from "../../middleware/cookieMakerValidator";

@JsonController("/cookie-maker/notification")
export default class NotificationController {
  protected _notificationService: NotificationService;

  constructor() {
    this._notificationService = Container.get(NotificationService);
  }

  // TO get list of Notifications.
  @Get("/", { transformRequest: true })
  @UseBefore(CookieMakerValidator)
  async GetNotification(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse
  ) {
    try {
      const restaurantId = req.context?.user.restaurantId,
        data = await this._notificationService.find(
          { restaurantId: mongoose.Types.ObjectId(restaurantId) },
          {}
        );

      return res.formatter.ok({ data }, true, "GET_NOTIFICATIONS");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "GET_NOTIFICATION_ERROR",
        err as Error
      );
    }
  }

  // To Update particular Notificaton
  @Put("/:id")
  async UpdateNotification(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Param("id") id: string,
    @BodyParam("isUnread") isUnread: boolean
  ) {
    try {
      const notification = await this._notificationService.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: { isUnread: isUnread } }
      );
      if (!notification)
        return res.formatter.error({}, false, "NOTIFICATION_NOT_FOUND!");
      return res.formatter.ok({}, true, "UPDATED_NOTIFICATION");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }
}
