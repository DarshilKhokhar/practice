import * as mongoose from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema: mongoose.Schema<IOrder> = new mongoose.Schema({
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "restaurant",
  },
  cookieMonsterId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "cookieMonster",
  },
  deliveryType: { type: String, required: true },
  payWith: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  deliveryCharge: { type: Number, required: true },
  VATCharge: { type: Number, required: true },
  payableAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now() },
  orderId: { type: String, unique: true },
  orderStatus: { type: String, enum: ['Waiting', 'Accepted', 'Rejected', 'Cooked', 'Picked By a Hero'], default: 'Waiting' },
  cartItems: [
    {
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
      menuCategoryId: { type: mongoose.Schema.Types.ObjectId, ref: "menuCategory" },
      menuItemId: { type: mongoose.Schema.Types.ObjectId, ref: "menuItem" },
    },
  ],
});

const orderModel = mongoose.model<IOrder>("order", orderSchema);
orderModel.ensureIndexes();

export default orderModel;
