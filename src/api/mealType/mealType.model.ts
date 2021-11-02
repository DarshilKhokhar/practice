import * as mongoose from "mongoose";
import { IMealType } from "./mealType.interface";

const mealTypeSchema: mongoose.Schema<IMealType> = new mongoose.Schema(
  {
    mealType: { type: String, required: true },
    image: { type: String, required: true },
    selectedImage: { type: String, required: true }
  },
  {
    timestamps: true,
  }
);

// cookieMonsterSchema.index({ mobileNumber: 1 });

const mealTypeModel = mongoose.model<IMealType>("mealType", mealTypeSchema);
mealTypeModel.ensureIndexes();

export default mealTypeModel;
