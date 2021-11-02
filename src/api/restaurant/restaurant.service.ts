import { EnvironmentCredentials } from "aws-sdk";
import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { IRestaurant } from "./restaurant.interface";
import restaurantModel from "./restaurant.model";

@Service()
export class RestaurantService {
  private model: Model<IRestaurant>;
  constructor() {
    this.model = restaurantModel;
  }

  async save(item: any): Promise<IRestaurant> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<IRestaurant>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
      return await this.model.find(query, projection, options).lean();
  }

  async findSortAsc(
    query: FilterQuery<IRestaurant>,
    projection: any,
    options: QueryOptions = { lean: true, sort: true }
  ){
    try{

      return await this.model.find(query, projection, options);
    }
    catch(err){
      return err;
    }
  }

  async findSortDes(){
    try{
      return await this.model.find();
    }
    catch(err){
      return EnvironmentCredentials;
    }
  }

  async findOne(
    query: FilterQuery<IRestaurant>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
      return await this.model.findOne(query, projection, options);
  }

  async findOneAndUpdate(
    query: FilterQuery<IRestaurant>,
    updateData: UpdateQuery<IRestaurant>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async aggregate(pipeLine:any[]) : Promise<any> {
    try {
      return await this.model.aggregate(pipeLine);
    } catch (err) {
      return err;
    }
  }

  async findByIdAndUpdate(
    query: FilterQuery<IRestaurant>,
    updateData: UpdateQuery<IRestaurant>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndUpdate(query, updateData, options);
  }

  async updateOne(
    query: FilterQuery<IRestaurant>,
    updateData: UpdateQuery<IRestaurant>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.updateOne(query, updateData, options);
  }
}
