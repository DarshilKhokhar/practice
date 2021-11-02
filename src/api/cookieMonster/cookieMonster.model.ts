import * as mongoose from "mongoose";
import { ICookieMonster } from "./cookieMonster.interface";
import { Document } from "mongoose";

const cookieMonsterSchema: mongoose.Schema<ICookieMonster> =
  new mongoose.Schema(
    {
      mobileNumber: { type: Number, required: true },
      countryCode: { type: String, required: true },
      otp: { type: Number },
      otpCreatedAtMilli: { type: Number, default: Date.now() },
      otpVerified: { type: Boolean, default: false },
      signUpCompleted: { type: Boolean, default: false },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      referralCode: { type: String },
      currentLocation: {
        type: { type: String, default: "Point", required: true },
        coordinates: { type: [], default: [0, 0], required: true },
      },
      address: [
        {
          nickName: { type: String },
          addressLine1: { type: String },
          addressLine2: { type: String },
          phoneNumber: { type: Number },
          location: {
            type: { type: String, default: "Point" },
            coordinates: { type: [], default: [0, 0], required: true },
          },
          isDefault: { type: Boolean, default: false },
        },
      ],
    },
    {
      timestamps: true,
    }
  );

// cookieMonsterSchema.index({ mobileNumber: 1 });
// cookieMonsterSchema.index({ "address.location": "2dsphere" });
cookieMonsterSchema.index({ currentLocation: "2dsphere" });

const cookieMonsterModel = mongoose.model<ICookieMonster>(
  "cookieMonster",
  cookieMonsterSchema
);
cookieMonsterModel.ensureIndexes();

//cookieMonsterModel.collection.dropIndex("address.location_2dsphere_currentLocation_2dsphere")

export default cookieMonsterModel;
