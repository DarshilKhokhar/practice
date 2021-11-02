import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { ICookieMaker } from "./cookieMaker.interface";
import cookieMakerModel from "./cookieMaker.model";

@Service()
export class CookieMakerService {
  private model: Model<ICookieMaker>;
  constructor() {
    this.model = cookieMakerModel;
  }

  async save(item: any): Promise<ICookieMaker> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<ICookieMaker>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.find(query, projection, options);
  }

  async findOne(
    query: FilterQuery<ICookieMaker>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOne(query, projection, options);
  }

  async findOneAndUpdate(
    query: FilterQuery<ICookieMaker>,
    updateData: UpdateQuery<ICookieMaker>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async updateOne(
    query: FilterQuery<ICookieMaker>,
    updateData: UpdateQuery<ICookieMaker>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.updateOne(query, updateData, options);
  }

  async findByIdAndDelete(
    query: FilterQuery<ICookieMaker>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndDelete(query, options);
  }
}
