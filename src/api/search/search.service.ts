import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { ISearch } from "./search.interface";
import searchModel from "./search.model";

@Service()
export class SearchService {
  private model: Model<ISearch>;
  constructor() {
    this.model = searchModel;
  }

  async save(item: any): Promise<ISearch> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<ISearch>,
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
    query: FilterQuery<ISearch>,
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
    query: FilterQuery<ISearch>,
    updateData: UpdateQuery<ISearch>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async findByIdAndDelete(
    query: FilterQuery<ISearch>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndDelete(query, options);
  }
}
