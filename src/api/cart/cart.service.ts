import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { ICart } from "./cart.interface";
import cartModel from "./cart.model";

@Service()
export class CartService {
  private model: Model<ICart>;
  constructor() {
    this.model = cartModel;
  }

  async save(item: any): Promise<ICart> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<ICart>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
      return await this.model.find(query, projection, options).lean().sort({"name": 1});
  }

  async findOne(
    query: FilterQuery<ICart>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
      return await this.model.findOne(query, projection, options);
  }

  async aggregate(pipeLine:any[]) : Promise<any> {
    try {
      return await this.model.aggregate(pipeLine);
    } catch (err) {
      return err;
    }
  }

  async findOneAndUpdate(
    query: FilterQuery<ICart>,
    updateData: UpdateQuery<ICart>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async findByIdAndUpdate(
    query: FilterQuery<ICart>,
    updateData: UpdateQuery<ICart>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndUpdate(query, updateData, options);
  }

  async findByIdAndDelete(
    query: FilterQuery<ICart>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndDelete(query, options);
  }
}
