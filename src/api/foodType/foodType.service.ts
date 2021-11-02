import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { IFoodType } from "./foodType.interface";
import foodTypeModel from "./foodType.model";

@Service()
export class FoodTypeService {
  private model: Model<IFoodType>;
  constructor() {
    this.model = foodTypeModel;
  }

  async save(item: any): Promise<IFoodType> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<IFoodType>,
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
    query: FilterQuery<IFoodType>,
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
    query: FilterQuery<IFoodType>,
    updateData: UpdateQuery<IFoodType>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async findByIdAndDelete(
    query: FilterQuery<IFoodType>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndDelete(query, options);
  }
}
