import * as mongoose from "mongoose";
import { IHomeBanner } from "./homeBanner.interface";

const homeBannerSchema: mongoose.Schema<IHomeBanner> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    backgroundImage: { type: String, required: true },
    keyword: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const homeBannerModel = mongoose.model<IHomeBanner>(
  "homeBanner",
  homeBannerSchema
);
homeBannerModel.ensureIndexes();

export default homeBannerModel;
