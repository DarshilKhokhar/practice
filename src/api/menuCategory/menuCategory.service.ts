import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { IMenuCategory } from "./menuCategory.interface";
import restaurantModel from "./menuCategory.model";

@Service()
export class MenuCategoryService {
  private model: Model<IMenuCategory>;
  constructor() {
    this.model = restaurantModel;
  }

  async save(item: any): Promise<IMenuCategory> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<IMenuCategory>,
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
    query: FilterQuery<IMenuCategory>,
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
    query: FilterQuery<IMenuCategory>,
    updateData: UpdateQuery<IMenuCategory>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async findByIdAndUpdate(
    query: FilterQuery<IMenuCategory>,
    updateData: UpdateQuery<IMenuCategory>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndUpdate(query, updateData, options);
  }

  async findByIdAndDelete(
    query: FilterQuery<IMenuCategory>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndDelete(query, options);
  }
}
