import { Type } from "class-transformer";
import {
  IsDefined,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";

class FavouriteRestaurant {
  @IsDefined()
  @IsString()
  restaurantId: string;
}

export class FavouriteRestaurantPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => FavouriteRestaurant)
  payload: FavouriteRestaurant;
}
