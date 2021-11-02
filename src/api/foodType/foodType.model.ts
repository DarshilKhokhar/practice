import * as mongoose from "mongoose";
import { IFoodType } from "./foodType.interface";

const foodTypeSchema: mongoose.Schema<IFoodType> = new mongoose.Schema(
  {
    foodType: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// cookieMonsterSchema.index({ mobileNumber: 1 });

const foodTypeModel = mongoose.model<IFoodType>("foodType", foodTypeSchema);
foodTypeModel.ensureIndexes();

export default foodTypeModel;
