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
} from "routing-controllers";
import Container from "typedi";
import {
  IExtendedRequest,
  IExtendedResponse,
  ITokenPayload,
} from "../../common/common-types";
import mongoose from "mongoose";
import { CookieMakerService } from "./cookieMaker.service";
import { SignUpPayload } from "./dto/signUp.dto";
import { encryptPwd } from "../../utils/common/password";
import { SignInPayload } from "./dto/signIn.dto";
import { createToken } from "../../utils/common/jwt";
import { SignUpUpdatePayload } from "./dto/signUpUpdate.dto";
import { ChangePasswordPayload } from "./dto/changePassword.dto";

@JsonController("/cookie-maker")
export default class CookieMakerController {
  protected _cookieMakerService: CookieMakerService;

  constructor() {
    this._cookieMakerService = Container.get(CookieMakerService);
  }

  @Post("/sign-up", { transformRequest: true })
  async signUp(@Res() res: IExtendedResponse, @Body() body: SignUpPayload) {
    try {
      const { email, password } = body.payload;
      // check if the user already exists or not
      const user = await this._cookieMakerService.findOne({ email }, {});
      if (user)
        return res.formatter.error({}, false, "USER_ALREADY_EXISTS_WITH_EMAIL");

      const encrypted = encryptPwd(password),
        item = body.payload;
      item.password = encrypted;
      const newUser = await this._cookieMakerService.save(item);
      return res.formatter.ok(newUser, true, "SIGNUP_SUCCESS");
    } catch (err) {
      return res.formatter.error({}, false, "SIGNUP_ERROR", err as Error);
    }
  }

  @Post("/login", { transformRequest: true })
  async userLogin(@Res() res: IExtendedResponse, @Body() body: SignInPayload) {
    try {
      const { email, password } = body.payload,
        user = await this._cookieMakerService.findOne({ email }, {});

      // check if the user exists or not
      if (!user) return res.formatter.error({}, false, "EMAIL_NOT_FOUND!");

      // compare the password
      const encrypted = encryptPwd(password);
      if (user.password !== encrypted)
        return res.formatter.error({}, false, "PASSWORD_DOES_NOT_MATCH");

      // generate the jwt token as login is successful
      const payload: ITokenPayload = {
          email: user.email,
          userId: user._id,
        },
        token = await createToken(payload);

      // Update the last login time.
      await this._cookieMakerService.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(user._id) },
        { lastLoginTime: Date.now() },
        {
          new: true,
        }
      );

      return res.formatter.ok(
        { signIn: true, accessToken: token },
        true,
        "SIGN-IN_SUCCESSFULLY!"
      );
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "SIGN-IN_ERROR!",
        new Error("Error!")
      );
    }
  }


  // To fetch list of Admin Users
  @Get("/users", { transformRequest: true })
  async ListAdminUsers(@Res() res: IExtendedResponse) {
    try {
      const projection = {
        name: 1,
        email: 1,
        lastLoginTime: 1,
        accountStatus: 1,
      };
      const adminUsers = await this._cookieMakerService.find({}, projection);
      return res.formatter.ok(adminUsers, true, "LIST_ADMIN_USER");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "LIST_ADMIN_USER_ERROR",
        err as Error
      );
    }
  }

  //Get Admin User Details.
  @Get("/users/:id", { transformRequest: true })
  async AdminUser(@Res() res: IExtendedResponse, @Param("id") id: string) {
    try {
      const projection = {
          name: 1,
          email: 1,
          lastLoginTime: 1,
          accountStatus: 1,
        },
        menuItem = await this._cookieMakerService.find(
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

  // Change Password
  @Put("/changePassword/users/:id", { transformRequest: true })
  async ChangePassword(
    @Res() res: IExtendedResponse,
    @Param("id") id: string,
    @Body() body: ChangePasswordPayload
  ){
    try{
      const {currentPassword, newPassword, repeatNewPassword} = body.payload,
      user = await this._cookieMakerService.findOne(
        { _id: mongoose.Types.ObjectId(id) }, { password: 1 }
      );
        
      if (!user) return res.formatter.error({}, false, "USER_NOT_FOUND");
        
      // compare the password
      const encrypted = encryptPwd(currentPassword);
      if (user.password !== encrypted)
        return res.formatter.error({}, false, "PASSWORD_DOES_NOT_MATCH");
      
      //compare the new password
      if(newPassword !== repeatNewPassword)
        return res.formatter.error({}, false, "NEW_PASSWORD_AND_REPEAT_PASSWORD_DOES_NOT_MATCH")
          
      const encryptedNew = encryptPwd(newPassword),
      password = encryptedNew,
      dataToUpdate = { password }

      await this._cookieMakerService.findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(id) },
        { $set: dataToUpdate },
        {
          new: true,
        }
      );
      return res.formatter.ok({}, true, "CHANGE_PASSWORD_SUCCESSFULLY");
    }
    catch(err){
      return res.formatter.error(
        {},
        false,
        "CHANGE_PASSWORD_ERROR!",
        err as Error
      );
    }
  }

  

  // Update Admin User
  @Put("/users/:id")
  async UpdateAdminUser(
    @Res() res: IExtendedResponse,
    @Param("id") id: string,
    @Body() body: SignUpUpdatePayload
  ) {
    try {
      const dataToUpdate = body.payload,
      user = await this._cookieMakerService.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(id) },
          { $set: dataToUpdate },
          {
            new: true,
          }
        );
      if (!user) return res.formatter.error({}, false, "USER_NOT_FOUND");
      return res.formatter.ok({ user }, true, "UPDATE_USER_DATA");
    } catch (err) {
      return res.formatter.error(
        {},
        false,
        "UPDATE_USER_DATA_ERROR",
        err as Error
      );
    }
  }

  // To Delete Admin User.
  @Delete("/users/:id")
  async DeleteAdminUser(
    @Res() res: IExtendedResponse,
    @Param("id") id: string
  ) {
    try {
      const user = await this._cookieMakerService.findByIdAndDelete(
        { _id: mongoose.Types.ObjectId(id) },
        {}
      );
      if (!user) return res.formatter.error({}, false, "USER_NOT_FOUND");
      return res.formatter.ok({}, true, "DELETED_USER");
    } catch (err) {
      return res.formatter.error({}, false, "DELETE_USER_ERROR", err as Error);
    }
  }
}
