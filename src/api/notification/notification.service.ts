import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { INotification } from "./notification.interface";
import notificationModel from "./notification.model";

@Service()
export class NotificationService {
  private model: Model<INotification>;
  constructor() {
    this.model = notificationModel;
  }

  async save(item: any): Promise<INotification> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<INotification>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
    try {
      return await this.model.find(query, projection, options).lean();
    } catch (err) {
      return err;
    }
  }

  async findOne(
    query: FilterQuery<INotification>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
    try {
      return await this.model.findOne(query, projection, options);
    } catch(err) {
      return err;
    }
  }

  async findOneAndUpdate(
    query: FilterQuery<INotification>,
    updateData: UpdateQuery<INotification>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async findByIdAndDelete(
    query: FilterQuery<INotification>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndDelete(query, options);
  }
}
