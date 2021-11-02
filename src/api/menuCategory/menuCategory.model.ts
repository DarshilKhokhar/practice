import * as mongoose from "mongoose";
import { IMenuCategory } from "./menuCategory.interface";

const menuCategorySchema: mongoose.Schema<IMenuCategory> = new mongoose.Schema(
  {
    categoryName: { type: String, required: true },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "restaurant",
    },
  },
  {
    timestamps: true,
  }
);

menuCategorySchema.index({ resturantId: 1 });
const menuCategoryModel = mongoose.model<IMenuCategory>(
  "menuCategory",
  menuCategorySchema
);
menuCategoryModel.ensureIndexes();

export default menuCategoryModel;
