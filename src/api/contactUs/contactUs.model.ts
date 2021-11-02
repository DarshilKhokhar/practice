import * as mongoose from "mongoose";
import { IContactUs } from "./contactUs.interface";

const contactUsSchema: mongoose.Schema<IContactUs> = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    email: { type: String },
    message: { type: String },
  },
  {
    timestamps: true,
  }
);

const contactUsModel = mongoose.model<IContactUs>(
  "contactUs",
  contactUsSchema
);
contactUsModel.ensureIndexes();

export default contactUsModel;
