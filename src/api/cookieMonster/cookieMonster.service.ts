import { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { Service } from "typedi";
import { ICookieMonster } from "./cookieMonster.interface";
import cookieMonsterModel from "./cookieMonster.model";

@Service()
export class CookieMonsterService {
  private model: Model<ICookieMonster>;
  constructor() {
    this.model = cookieMonsterModel;
  }

  async save(item: any): Promise<ICookieMonster> {
    return await this.model.create(item);
  }

  async findOne(
    query: FilterQuery<ICookieMonster>,
    projection: any,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOne(query, projection, options);
  }

  async findOneAndUpdate(
    query: FilterQuery<ICookieMonster>,
    updateData: UpdateQuery<ICookieMonster>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.findOneAndUpdate(query, updateData, options);
  }

  async updateOne(
    query: FilterQuery<ICookieMonster>,
    updateData: UpdateQuery<ICookieMonster>,
    options: QueryOptions = { lean: true }
  ) {
    return await this.model.updateOne(query, updateData, options);
  }
}
