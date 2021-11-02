import { Type } from 'class-transformer';
import {
  IsDefined,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class FoodType {
  @IsString()
  @IsDefined()
  foodType: string;
}

export class FoodTypePayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => FoodType)
  payload: FoodType;
}
