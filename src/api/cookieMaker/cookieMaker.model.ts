import * as mongoose from "mongoose";
import { ICookieMaker } from "./cookieMaker.interface";

const cookieMakerSchema: mongoose.Schema<ICookieMaker> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    accountStatus: { type: String, enum: ['Enabled', 'Disabled'], default: 'Enabled' },
    token: { type: String },
    lastLoginTime: { type: Number, default: Date.now() },
    tokenCreatedTime: { type: Number, default: Date.now(), expires: 600 },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurant",
      default: null
    },
  },
  {
    timestamps: true,
  }
);

// cookieMonsterSchema.index({ mobileNumber: 1 });
//cookieMonsterSchema.index({ "address.location": "2dsphere", "currentLocation": "2dsphere" });

const cookieMakerModel = mongoose.model<ICookieMaker>(
  "cookieMaker",
  cookieMakerSchema
);
cookieMakerModel.ensureIndexes();

export default cookieMakerModel;
