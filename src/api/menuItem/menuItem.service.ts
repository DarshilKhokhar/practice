import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { IMenuItem } from "./menuItem.interface";
import restaurantModel from "./menuItem.model";

@Service()
export class MenuItemService {
  private model: Model<IMenuItem>;
  constructor() {
    this.model = restaurantModel;
  }

  async save(item: any): Promise<IMenuItem> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<IMenuItem>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
      return await this.model.find(query, projection, options).lean();
  }

  async findPopular(
    query: FilterQuery<IMenuItem>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
      return await this.model.find(query, projection, options).lean();
  }

  async findOne(
    query: FilterQuery<IMenuItem>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
      return await this.model.findOne(query, projection, options);
  }

  async findOneAndUpdate(
    query: FilterQuery<IMenuItem>,
    updateData: UpdateQuery<IMenuItem>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async findByIdAndUpdate(
    query: FilterQuery<IMenuItem>,
    updateData: UpdateQuery<IMenuItem>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndUpdate(query, updateData, options);
  }

  async findByIdAndDelete(
    query: FilterQuery<IMenuItem>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndDelete(query, options);
  }
}
