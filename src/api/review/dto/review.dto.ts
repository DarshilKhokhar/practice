import { Type } from "class-transformer";
import {
  IsString,
  IsDefined,
  IsNumber,
  IsObject,
  ValidateNested,
  IsOptional,
} from "class-validator";

class review {
  @IsString()
  @IsDefined()
  restaurantId: string;

  @IsNumber()
  @IsOptional()
  rating: number;

  @IsString()
  @IsOptional()
  reviewComment: string;
}

export class ReviewPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => review)
  payload: review;
}
