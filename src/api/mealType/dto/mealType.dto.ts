import { Type } from 'class-transformer';
import {
  IsDefined,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class MealType {
  @IsString()
  @IsDefined()
  mealType: string;

  @IsString()
  @IsDefined()
  image: string;

  @IsString()
  @IsDefined()
  selectedImage: string;
}

export class MealTypePayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => MealType)
  payload: MealType;
}
