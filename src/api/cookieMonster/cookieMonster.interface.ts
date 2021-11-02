import { Document } from "mongoose";

export interface ICookieMonster extends Document {
  mobileNumber: number;
  otp: number;
  otpCreatedAtMilli: number;
  countryCode: string;
  otpVerified: boolean;
  signUpCompleted: boolean;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string;
  currentLocation: {
    type: string;
    coordinates: number[]
  }
  address: [{
    nickName: string;
    addressLine1: string;
    addressLine2: string;
    phoneNumber: number;
    location: {
      type: string;
      coordinates: number[];
    }
    isDefault?: boolean;
  }]
}