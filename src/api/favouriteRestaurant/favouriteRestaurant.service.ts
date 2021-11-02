import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { IFavouriteRestaurant } from "./favouriteRestaurant.interface";
import favouriteRestaurantModel from "./favouriteRestaurant.model";

@Service()
export class FavouriteRestaurantService {
  private model: Model<IFavouriteRestaurant>;
  constructor() {
    this.model = favouriteRestaurantModel;
  }

  async save(item: any): Promise<IFavouriteRestaurant> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<IFavouriteRestaurant>,
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
    query: FilterQuery<IFavouriteRestaurant>,
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
    query: FilterQuery<IFavouriteRestaurant>,
    updateData: UpdateQuery<IFavouriteRestaurant>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async findByIdAndUpdate(
    query: FilterQuery<IFavouriteRestaurant>,
    updateData: UpdateQuery<IFavouriteRestaurant>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndUpdate(query, updateData, options);
  }

  async findByIdAndDelete(
    query: FilterQuery<IFavouriteRestaurant>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndDelete(query, options);
  }
}
