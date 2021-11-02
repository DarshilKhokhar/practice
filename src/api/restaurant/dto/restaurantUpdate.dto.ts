import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Location {
  @IsOptional()
  @IsString()
  type: string;

  @IsArray()
  coordinates: [];
}

class Address {
  @IsString()
  @IsOptional()
  country: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsOptional()
  @IsNumber()
  postalCode: number;

  @IsString()
  @IsOptional()
  street: string;

  @ValidateNested({ each: true })
  @IsObject()
  @IsOptional()
  @Type(() => Location)
  location: Location;
}

class Restaurant {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsString()
  logo: string;

  @IsOptional()
  @IsArray()
  bannerImage: [string];

  @IsOptional()
  @IsNumber()
  phoneNumber: number;

  @IsOptional()
  @IsNumber()
  minOrderValue: number;

  @IsOptional()
  @IsNumber()
  maxOrderValue: number;

  @IsArray()
  @IsOptional()
  foodType: [string];

  @IsOptional()
  @IsString()
  openingTime: string

  @IsOptional()
  @IsString()
  closingTime: string

  @IsOptional()
  @IsString()
  deliveryTime: string

  @IsOptional()
  @IsString()
  lastOrderTime: string;

  @IsOptional()
  @IsNumber()
  deliveryCharge: number;

  @IsArray()
  @IsOptional()
  deliveryType: [string];

  @IsArray()
  @IsOptional()
  offeredMealType: [string];

  @ValidateNested({ each: true })
  @IsObject()
  @IsOptional()
  @Type(() => Address)
  address: Address;
}

export class RestaurantUpdatePayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => Restaurant)
  payload: Restaurant;
}
