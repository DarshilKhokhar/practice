import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { IMealType } from "./mealType.interface";
import mealTypeModel from "./mealType.model";

@Service()
export class MealTypeService {
  private model: Model<IMealType>;
  constructor() {
    this.model = mealTypeModel;
  }

  async save(item: any): Promise<IMealType> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<IMealType>,
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
    query: FilterQuery<IMealType>,
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
    query: FilterQuery<IMealType>,
    updateData: UpdateQuery<IMealType>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async findByIdAndDelete(
    query: FilterQuery<IMealType>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndDelete(query, options);
  }
}
