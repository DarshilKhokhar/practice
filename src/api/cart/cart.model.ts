import * as mongoose from "mongoose";
import { ICart } from "./cart.interface";

const cartSchema: mongoose.Schema<ICart> = new mongoose.Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
  image: { type: String, required: true },
  quantity: { type: Number, required: true },
  choices: [{ type: String, required: true }],
  extras: [
    {
      name: { type: String, required: true },
      calories: { type: Number, required: true },
      amount: { type: Number, required: true },
    },
  ],
  additionalComments: { type: String },
  isOrdered: { type: Boolean, default: false },
  menuCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "menuCategory" },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "restaurant" },
  menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "menuItem" },
  cookieMonsterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "cookieMonster",
  },
});

const cartModel = mongoose.model<ICart>("cart", cartSchema);
cartModel.ensureIndexes();

export default cartModel;
