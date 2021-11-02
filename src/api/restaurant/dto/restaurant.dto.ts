import { Type } from "class-transformer";
import {
  IsArray,
  IsDefined,
  IsNumber,
  isObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class Location {
  @IsOptional()
  @IsString()
  type: string;

  @IsArray()
  coordinates: [];
}

class Address {
  @IsString()
  @IsDefined()
  country: string;

  @IsString()
  @IsDefined()
  state: string;

  @IsString()
  @IsDefined()
  city: string;

  @IsDefined()
  @IsNumber()
  postalCode: number;

  @IsString()
  @IsDefined()
  street: string;

  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => Location)
  location: Location;
}

class Restaurant {
  @IsString()
  @IsDefined()
  name: string;

  @IsDefined()
  @IsString()
  logo: string;

  @IsOptional()
  @IsArray()
  bannerImage: [string];

  @IsDefined()
  @IsNumber()
  phoneNumber: number;

  @IsDefined()
  @IsNumber()
  minOrderValue: number;

  @IsDefined()
  @IsNumber()
  maxOrderValue: number;

  @IsArray()
  @IsDefined()
  foodType: [string];

  @IsDefined()
  @IsString()
  openingTime: string

  @IsDefined()
  @IsString()
  closingTime: string

  @IsDefined()
  @IsString()
  deliveryTime: string

  @IsDefined()
  @IsString()
  lastOrderTime: string;

  @IsOptional()
  @IsNumber()
  deliveryCharge: number;

  @IsArray()
  @IsDefined()
  deliveryType: [string];

  @IsArray()
  @IsOptional()
  offeredMealType: [string];

  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => Address)
  address: Address;
}

export class RestaurantPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => Restaurant)
  payload: Restaurant;
}
