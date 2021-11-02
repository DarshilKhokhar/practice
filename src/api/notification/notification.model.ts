import * as mongoose from "mongoose";
import { INotification } from "./notification.interface";

const notificationSchema: mongoose.Schema<INotification> = new mongoose.Schema(
  {
    message: { type: String, required: true },
    date: { type: Number, default: Date.now() },
    isUnread: { type: Boolean, default: true },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "restaurant",
    }
  },
  {
    timestamps: true,
  }
);

const notificationModel = mongoose.model<INotification>("notification", notificationSchema);
notificationModel.ensureIndexes();

export default notificationModel;
