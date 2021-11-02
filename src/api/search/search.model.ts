import * as mongoose from "mongoose";
import { ISearch } from "./search.interface";

const searchSchema: mongoose.Schema<ISearch> = new mongoose.Schema(
  {
    value: { type: String, required: true },
    type: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// cookieMonsterSchema.index({ mobileNumber: 1 });

const searchModel = mongoose.model<ISearch>("search", searchSchema);
searchModel.ensureIndexes();

export default searchModel;
