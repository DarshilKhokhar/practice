import { Response, Request } from "express";
import { IRestaurant } from "../api/restaurant/restaurant.interface";

export interface IExtendedResponse extends Response {
  formatter: IResponseFormatter;
}

export interface IExtendedRequest extends Request {
  context?: IRequestContext
}

interface IRequestContext {
  user: IUser
}

interface IUser {
  _id: string;
  email?: string;
  restaurantId?: IRestaurant["_id"];
  mobileNumber: number;
  firstName: string;
  signUpCompleted: number
}

export interface IResponseFormatter {
  error: IResponseErrorFormatter;
  ok: IResponseSuccessFormatter;
}

export type GenericObject = Record<string, any>;

export interface IResponseData {
  data: GenericObject | null;
  status: boolean;
  code: string;
  lang?: string;
  err?: Error;
}

export interface IResponseSuccessFormatter {
  (data: GenericObject, status: boolean, code: string): IOkFormatter;
}

export interface IResponseErrorFormatter {
  (
    data: GenericObject | null,
    status: boolean,
    code: string,
    err?: Error
  ): IErrorFormatter;
}

export interface IErrorFormatter {
  status: boolean;
  error: {
    code: string;
    message: string;
    data: GenericObject | null;
    errorStack: Error | undefined;
  };
  success: null;
}

export interface IOkFormatter {
  status: boolean;
  success: {
    code: string;
    message: string;
    data: Record<string, any>
  };
  error: null;
}

export interface ITokenPayload {
  userId: string;
  email?: string;
  mobileNumber?: number;
  restaurantId?: IRestaurant["_id"];
}