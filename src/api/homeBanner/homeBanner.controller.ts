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
import { HomeBannerService } from "./homeBanner.service";
import { HomeBannerPayload } from "./dto/homeBanner.dto";
import mongoose from "mongoose";

@JsonController("/home-banner")
export default class HomeBannerController {
  protected _homeBannerService: HomeBannerService;

  constructor() {
    this._homeBannerService = Container.get(HomeBannerService);
  }

  // To add HomePage Banner Data.
  @Post("/", { transformRequest: true })
  async AddHomeBanner(
    @Res() res: IExtendedResponse,
    @Body() body: HomeBannerPayload
  ) {
    try {
      const { title, description, backgroundImage, keyword } = body.payload,
        // Save HomePage Banner data in DB.
        dataTosave = {
          title,
          description,
          backgroundImage,
          keyword,
        },
        homeBanner = await this._homeBannerService.save(dataTosave);

      return res.formatter.ok(homeBanner, true, "HOMEPAGE_BANNER_DATA_SAVED!");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  // To get HomePage Banner Data.
  @Get("/", { transformRequest: true })
  async GetHomeBanne(@Res() res: IExtendedResponse) {
    try {
      const data = await this._homeBannerService.find({}, {}, {});

      return res.formatter.ok({ data }, true, "FETCHED_HOMEPAGE_BANNER_DATA!");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  // To Delete Particular Banner data.
  @Delete("/:id")
  async DeleteMenuItem(@Res() res: IExtendedResponse, @Param("id") id: string) {
    try {
      const banner = await this._homeBannerService.findByIdAndDelete(
        { _id: mongoose.Types.ObjectId(id) },
        {}
      );
      if (!banner) return res.formatter.error({}, false, "ITEM_NOT_FOUND!");
      return res.formatter.ok({}, true, "DELETED_BANNER_DATA");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }
}
