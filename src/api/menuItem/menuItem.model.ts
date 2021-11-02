import * as mongoose from "mongoose";
import { IMenuItem } from "./menuItem.interface";

const menuItemSchema: mongoose.Schema<IMenuItem> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    calories: { type: Number, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    image: { type: String, required: true },
    isAvailable: { type: Boolean, required: true, default: true },
    itemCount: { type: Number, default: 0 },
    soldCount: { type: Number, default: 0 },
    itemDetails: {
      choices: [{ type: String, required: true }],
      extras: [
        {
          name: { type: String, required: true },
          calories: { type: Number, required: true },
          amount: { type: Number, required: true },
        },
      ],
    },
    menuCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "menuCategory",
    },
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

menuItemSchema.index({ resturantId: 1 });
const menuItemModel = mongoose.model<IMenuItem>("menuItem", menuItemSchema);
menuItemModel.ensureIndexes();

export default menuItemModel;
