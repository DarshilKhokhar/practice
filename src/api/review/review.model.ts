import mongoose from "mongoose";
import { IReview } from "./review.interface";

const reviewSchema: mongoose.Schema<IReview> = new mongoose.Schema({
    cookieMonsterId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "cookieMonster",
    },
    restaurantId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "restaurant",
    },
    rating: { type: Number },
    reviewComment: { type: String },
    reviewDate: { type: Date, default: Date.now() }
})

const reviewModel = mongoose.model<IReview>("review", reviewSchema);
reviewModel.ensureIndexes();

export default reviewModel;