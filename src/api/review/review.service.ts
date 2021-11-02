import { FilterQuery, Model, QueryOptions } from "mongoose";
import { Service } from "typedi";
import { IReview } from "./review.interface";
import reviewModel from "./review.model";

@Service()
export class ReviewService{
    private model: Model<IReview>
    
    constructor(){
        this.model = reviewModel;
    }

    async save(item: any): Promise<IReview>{
        return await this.model.create(item);
    }

    async find(
        query: FilterQuery<IReview>,
        projection: any,
        options: QueryOptions = { lean: true }
    ) {
        return await this.model.find(query, projection, options).lean();
    }

    async findPopular(
        query: FilterQuery<IReview>,
        projection: any,
        options: QueryOptions = { lean: true }
    ) {
        return await this.model.find(query, projection, options).lean();
    }

    async aggregate(pipeLine:any[]) : Promise<any> {
        try {
          return await this.model.aggregate(pipeLine);
        } catch (err) {
          return err;
        }
      }

}