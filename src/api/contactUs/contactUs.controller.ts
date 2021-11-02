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
import { ContactUsService } from "./contactUs.service";
import mongoose from "mongoose";
import { ContactUsPayload } from "./dto/contactUs.dto";

@JsonController("/contact-us")
export default class ContactUsController {
  protected _contactUsService: ContactUsService;

  constructor() {
    this._contactUsService = Container.get(ContactUsService);
  }

  // To add Meal Type..
  @Post("/", { transformRequest: true })
  async AddContactData(
    @Res() res: IExtendedResponse,
    @Body() body: ContactUsPayload
  ) {
    try {
      const { name, phoneNumber, email, message } = body.payload;

      // Save contact Us data in DB
      const dataTosave = {
          name,
          phoneNumber,
          email,
          message,
        },
        contactDetails = await this._contactUsService.save(dataTosave);

      return res.formatter.ok(contactDetails, true, "CONTACT_US_DATA_SAVED");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "CONTACT_US_ADD_FAILURE",
        err as Error
      );
    }
  }

  // To get data for contact us.
  @Get("/", { transformRequest: true })
  async GetContactData(@Res() res: IExtendedResponse) {
    try {
      const data = await this._contactUsService.find({}, {}, {});

      return res.formatter.ok({ data }, true, "CONTACT_DETAILS");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "CONTACT_US_DATA_ERROR",
        err as Error
      );
    }
  }
}
