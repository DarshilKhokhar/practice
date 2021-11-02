import * as mongoose from "mongoose";
import { IRestaurant } from "./restaurant.interface";

const restaurantSchema: mongoose.Schema<IRestaurant> = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  logo: { type: String, required: true },
  bannerImage: [{ type: String, required: true }],
  phoneNumber: { type: Number },
  minOrderValue: { type: Number },
  maxOrderValue: { type: Number },
  openingTime: { type: String },
  closingTime: { type: String },
  deliveryTime: { type: String },
  lastOrderTime: { type: String },
  deliveryType: [{ type: String, required: true }],
  deliveryCharge: { type: Number, default: 20 },
  foodType: [{ type: String }],
  isActive: { type: Number, default: 1 },
  avgRatings: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  offer: [{
    offerType: { type: String, enum: ['Selected Items', 'All Menu', 'Promocode', 'Banner'] },
    status: { type: String, enum: ['Pending', 'Rejected', 'Accepted'], default: 'Pending' },
    discount: { type: Number },
    startDate: { type: String },
    endDate: { type: String },
    description: { type: String },
    bannerImage: { type: String },
  }],
  address: {
    country: { type: String, required: true },
    state: { tyepe: String },
    city: { type: String, required: true },
    postalCode: { type: Number, required: true },
    street: { type: String, required: true },
    location: {
      type: { type: String, default: "Point" },
      coordinates: { type: [], default: [0, 0], required: true },
    },
  },
},{
  timestamps: true
});

restaurantSchema.index({ "address.location": "2dsphere" });
//restaurantSchema.index({ name: 1, description: 1, offeredMealType: 1});

const restaurantModel = mongoose.model<IRestaurant>(
  "restaurant",
  restaurantSchema
);
restaurantModel.ensureIndexes();

export default restaurantModel;
