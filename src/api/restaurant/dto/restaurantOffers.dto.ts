import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class offers {
  @IsString()
  @IsDefined()
  offerType: string;

  @IsDefined()
  @IsNumber()
  discount: number;

  @IsDefined()
  @IsString()
  startDate: string;

  @IsString()
  @IsDefined()
  endDate: string;

  @IsString()
  @IsDefined()
  description: string;

  @IsBoolean()
  @IsDefined()
  isActive: boolean;

  @IsOptional()
  @IsString()
  bannerImage: string;
}

export class restaurantOffers {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => offers)
  offer: offers;
}
