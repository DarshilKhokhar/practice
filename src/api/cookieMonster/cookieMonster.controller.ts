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
import SendOtp from "../../utils/aws/sendOtp";
import { CookieMonsterService } from "./cookieMonster.service";
import { SendOtpPayload } from "./dto/sendOtp.dto";
import mongoose from "mongoose";
import { VerifyOtpPayload } from "./dto/verifyOtp";
import { ResendOtpPayload } from "./dto/resendOtp";
import { SignUpPayload } from "./dto/signUp.dto";
import { createToken } from "../../utils/common/jwt";
import { CookieMonsterCurrentAddressPayload } from "./dto/cookieMonsterCurrentAddress.dto";
import { CookieUserValidator } from "../../middleware/cookieUserValidator";
import { CookieMonsterAddressPayload } from "./dto/cookieMonsterAddress.dto";

@JsonController("/user")
export default class CookieMonsterController {
  protected _cookieMonsterService: CookieMonsterService;
  protected _smsService: SendOtp;

  constructor() {
    this._cookieMonsterService = Container.get(CookieMonsterService);
    this._smsService = Container.get(SendOtp);
  }

  @Post("/send/otp", { transformRequest: true })
  async sendOtp(@Res() res: IExtendedResponse, @Body() body: SendOtpPayload) {
    try {
      const { mobileNumber, countryCode, isEdit = false, id } = body.payload;

      // check if the mobile number already exists or not
      const query = {
          mobileNumber,
          signUpCompleted: true,
        },
        user = await this._cookieMonsterService.findOne(query, { _id: 1 });
      if (user) return res.formatter.error({}, false, "USER_ALREADY_EXISTS");

      // generate OTP for the user and save it in the DB
      const otp = Math.floor(1000 + Math.random() * 9000),
        dataTosave = {
          mobileNumber,
          otp,
          otpCreatedAtMilli: Date.now(),
          countryCode,
          otpVerified: false,
          signUpCompleted: false,
        };

      const numberToSendOtp = `${countryCode}${mobileNumber}`;

      let userQuery: { [key: string]: any };
      if (isEdit && id) {
        userQuery = {
          _id: mongoose.Types.ObjectId(id),
        };
      } else {
        userQuery = {
          mobileNumber,
        };
      }

      const response = await Promise.all([
        this._cookieMonsterService.findOneAndUpdate(userQuery, dataTosave, {
          lean: true,
          upsert: true,
          new: true,
        }),
        this._smsService.sendOtpToMobile(numberToSendOtp, otp),
      ]);

      return res.formatter.ok({ userId: response[0]?._id }, true, "OTP_SENT");
    } catch (err) {
      return res.formatter.error({}, false, "OTP_FAILURE", err as Error);
    }
  }

  @Post("/verify/otp", { transformRequest: true })
  async verifyOtp(
    @Res() res: IExtendedResponse,
    @Body() body: VerifyOtpPayload
  ) {
    try {
      const { mobileNumber, otp, userId } = body.payload;

      // check if the user is available or not
      const userQuery = {
          _id: mongoose.Types.ObjectId(userId),
          mobileNumber,
        },
        projection = {
          _id: 1,
          countryCode: 1,
          otp: 1,
          otpCreatedAtMilli: 1,
        },
        user = await this._cookieMonsterService.findOne(userQuery, projection, {
          lean: true,
        });
      if (!user) return res.formatter.error({}, false, "USER_NOT_FOUND");

      // check if otp is expired or not (5 mins after creation)
      const otpExpiryTime = user.otpCreatedAtMilli + 5 * 60 * 1000;
      if (Date.now() > otpExpiryTime)
        return res.formatter.error({}, false, "OTP_EXPIRED");

      if (otp === user.otp) {
        this._cookieMonsterService.findOneAndUpdate(
          userQuery,
          { otpVerified: true },
          { lean: true }
        );
        return res.formatter.ok({ verified: true }, true, "OTP_VERIFIED");
      }

      return res.formatter.error({}, false, "OTP_DID_NOT_MATCH");
    } catch (err) {
      return res.formatter.error({}, false, "OTP_VERIFY_ERROR", err as Error);
    }
  }

  @Post("/resend/otp", { transformRequest: true })
  async resendOtp(
    @Res() res: IExtendedResponse,
    @Body() body: ResendOtpPayload
  ) {
    try {
      const { mobileNumber, userId } = body.payload;

      // check if valid user with mobile number exists or not
      const userQuery = {
          _id: mongoose.Types.ObjectId(userId),
          mobileNumber,
        },
        user = await this._cookieMonsterService.findOne(
          userQuery,
          { _id: 1, countryCode: 1, otpVerified: 1 },
          {
            lean: true,
          }
        );
      if (!user) return res.formatter.error({}, false, "USER_NOT_FOUND");

      if (user.otpVerified)
        return res.formatter.error({}, false, "OTP_ALREADY_VERIFIED");

      // generate new otp and send it to user, also update the value in the DB
      const otp = Math.floor(1000 + Math.random() * 9000),
        numberToSend = `${user.countryCode}${mobileNumber}`,
        dataToUpdate = {
          otp,
          otpCreatedAtMilli: Date.now(),
        };
      await Promise.all([
        this._cookieMonsterService.findOneAndUpdate(userQuery, dataToUpdate),
        this._smsService.sendOtpToMobile(numberToSend, otp),
      ]);

      return res.formatter.ok({ sent: true }, true, "OTP_SENT");
    } catch (err) {
      return res.formatter.error({}, false, "OTP_FAILURE", err as Error);
    }
  }

  @Post("/sign-up", { transformRequest: true })
  async signUp(@Res() res: IExtendedResponse, @Body() body: SignUpPayload) {
    try {
      const {
        firstName,
        lastName,
        email,
        referralCode = "",
        userId,
      } = body.payload;

      // check if Mobile Number is verified or not
      const userQuery = {
          _id: mongoose.Types.ObjectId(userId),
        },
        userDetails = await this._cookieMonsterService.findOne(
          userQuery,
          { _id: 1, otpVerified: 1, signUpCompleted: 1 },
          {
            lean: true,
          }
        );

      if (!userDetails) return res.formatter.error({}, false, "USER_NOT_FOUND");

      if (!userDetails.otpVerified)
        return res.formatter.error({}, false, "MOBILE_NOT_VERIFIED");

      if (userDetails.signUpCompleted)
        return res.formatter.error({}, false, "ALREADY_SIGN_UP");

      const dataTosave = {
        firstName,
        lastName,
        email,
        referralCode,
        signUpCompleted: true,
        currentLocation: {
          type: "Point",
          coordinates: [0, 0],
        },
      };

      const payload = {
          userId: userId.toString(),
        },
        [, token] = await Promise.all([
          this._cookieMonsterService.findOneAndUpdate(userQuery, dataTosave, {
            lean: true,
          }),
          createToken(payload),
        ]);
      return res.formatter.ok(
        { signup: true, accessToken: token },
        true,
        "SIGNUP_SUCCESS"
      );
    } catch (err) {
      return res.formatter.error({}, false, "SIGNUP_ERROR", err as Error);
    }
  }

  @Post("/address", { transformRequest: true })
  @UseBefore(CookieUserValidator)
  async addAddress(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: CookieMonsterAddressPayload
  ) {
    try {
      const {
          nickName,
          addressLine2,
          addressLine1,
          phoneNumber,
          location,
          isDefault,
        } = body.payload.address,
        dataTosave = {
          address: {
            nickName,
            addressLine1,
            addressLine2,
            phoneNumber,
            location,
            isDefault,
          },
        },
        cookieMonsterId = req.context?.user._id,
        userQuery = {
          _id: mongoose.Types.ObjectId(cookieMonsterId),
        },
        cookieMonsterAddress =
          await this._cookieMonsterService.findOneAndUpdate(
            userQuery,
            { $push: dataTosave },
            {
              lean: true,
            }
          );
      if (!cookieMonsterAddress)
        return res.formatter.error({}, false, "USER_NOT_FOUND!");
      return res.formatter.ok({ addressAdded: true }, true, "ADDRESS_SAVED!");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  @Get("/address", { transformRequest: true })
  @UseBefore(CookieUserValidator)
  async getAddress(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse
  ) {
    try {
      const cookieMonsterId = req.context?.user._id,
        cookieMonsterAddress = await this._cookieMonsterService.findOne(
          { _id: mongoose.Types.ObjectId(cookieMonsterId) },
          { address: 1 }
        );
      if (!cookieMonsterAddress)
        return res.formatter.error({}, false, "USER_NOT_FOUND!");
      if (!cookieMonsterAddress.address)
        return res.formatter.error({}, false, "ADDRESS_NOT_FOUND_FOR_USER!");
      return res.formatter.ok(cookieMonsterAddress, true, "SAVED_ADDRESS!");
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  @Put("/address/:id")
  @UseBefore(CookieUserValidator)
  async UpdateAddress(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: CookieMonsterAddressPayload,
    @Param("id") id: string
  ) {
    try {
      const cookieMonsterId = req.context?.user._id,
        query = {
          _id: mongoose.Types.ObjectId(cookieMonsterId),
          "address._id": mongoose.Types.ObjectId(id),
        },
        updatedAddress = await this._cookieMonsterService.updateOne(query, {
          $set: {
            "address.$": body.payload.address,
          },
        });
      return res.formatter.ok(
        updatedAddress,
        true,
        "UPDATED_COOKIE_MONSTER_ADDRESS!"
      );
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  @Delete("/address/:id")
  @UseBefore(CookieUserValidator)
  async DeleteAddress(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Param("id") id: string
  ) {
    try {
      const cookieMonsterId = req.context?.user._id,
        query = {
          _id: mongoose.Types.ObjectId(cookieMonsterId),
        },
        DeletedAddress = await this._cookieMonsterService.updateOne(query, {
          $pull: { address: { _id: mongoose.Types.ObjectId(id) } },
        });
      return res.formatter.ok(
        DeletedAddress,
        true,
        "DELETED_COOKIE_MONSTER_ADDRESS!"
      );
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }

  @Post("/current/address", { transformRequest: true })
  @UseBefore(CookieUserValidator)
  async addCurrentAddress(
    @Req() req: IExtendedRequest,
    @Res() res: IExtendedResponse,
    @Body() body: CookieMonsterCurrentAddressPayload
  ) {
    try {
      const { coordinates } = body.location,
        dataTosave = {
          currentLocation: {
            type: "Point",
            coordinates,
          },
        },
        cookieMonsterId = req.context?.user._id,
        userQuery = {
          _id: mongoose.Types.ObjectId(cookieMonsterId),
        };
      const cookieMonsterCurrentAddress =
        await this._cookieMonsterService.findOneAndUpdate(
          userQuery,
          { $set: dataTosave },
          {
            lean: true,
          }
        );
      if (!cookieMonsterCurrentAddress)
        return res.formatter.error({}, false, "USER_NOT_FOUND!");
      return res.formatter.ok(
        { CurrentAddressAdded: true },
        true,
        "CURRENT_ADDRESS_SAVED!"
      );
    } catch (err) {
      return res.formatter.error({}, false, "ERROR!", err as Error);
    }
  }
}
