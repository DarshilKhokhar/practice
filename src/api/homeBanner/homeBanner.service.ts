import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { IHomeBanner } from "./homeBanner.interface";
import homeBannerModel from "./homeBanner.model";

@Service()
export class HomeBannerService {
  private model: Model<IHomeBanner>;
  constructor() {
    this.model = homeBannerModel;
  }

  async save(item: any): Promise<IHomeBanner> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<IHomeBanner>,
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
    query: FilterQuery<IHomeBanner>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
    try {
      return await this.model.findOne(query, projection, options);
    } catch(err) {
      return err;
    }
  }

  async findByIdAndDelete(
    query: FilterQuery<IHomeBanner>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndDelete(query, options);
  }
}
