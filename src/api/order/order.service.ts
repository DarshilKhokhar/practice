import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { IOrder } from "./order.interface";
import cartModel from "./order.model";

@Service()
export class OrderService {
  private model: Model<IOrder>;
  constructor() {
    this.model = cartModel;
  }

  async save(item: any): Promise<IOrder> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<IOrder>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
      return await this.model.find(query, projection, options).lean();
  }

  async findAll(
    query: FilterQuery<IOrder>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
      return await this.model.find(query, projection, options);
  }

  async findOne(
    query: FilterQuery<IOrder>,
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
    query: FilterQuery<IOrder>,
    updateData: UpdateQuery<IOrder>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async findByIdAndUpdate(
    query: FilterQuery<IOrder>,
    updateData: UpdateQuery<IOrder>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndUpdate(query, updateData, options);
  }

  async findByIdAndDelete(
    query: FilterQuery<IOrder>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndDelete(query, options);
  }
}
