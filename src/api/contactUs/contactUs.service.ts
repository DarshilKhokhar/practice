import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { IContactUs } from "./contactUs.interface";
import contactUsModel from "./contactUs.model";

@Service()
export class ContactUsService {
  private model: Model<IContactUs>;
  constructor() {
    this.model = contactUsModel;
  }

  async save(item: any): Promise<IContactUs> {
    return await this.model.create(item);
  }

  async find(
    query: FilterQuery<IContactUs>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.find(query, projection, options);
  }

  async findOne(
    query: FilterQuery<IContactUs>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOne(query, projection, options);
  }

  async findOneAndUpdate(
    query: FilterQuery<IContactUs>,
    updateData: UpdateQuery<IContactUs>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async updateOne(
    query: FilterQuery<IContactUs>,
    updateData: UpdateQuery<IContactUs>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.updateOne(query, updateData, options);
  }

  async findByIdAndDelete(
    query: FilterQuery<IContactUs>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findByIdAndDelete(query, options);
  }
}
