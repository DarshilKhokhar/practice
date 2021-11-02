import {
  IsDefined,
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsString,
} from "class-validator";

export class RestaurantParams {
  @IsNumber()
  @IsOptional()
  isActive: number;

  @IsString()
  @IsOptional()
  mealTypeId: string;

  @IsString()
  @IsOptional()
  search: string;

  @IsLatitude()
  @IsOptional()
  latt: string;

  @IsLongitude()
  @IsOptional()
  long: string;

  @IsString()
  @IsOptional()
  sortBy: string;

  @IsString()
  @IsOptional()
  OrderBy: string;

  @IsString()
  @IsOptional()
  FD: string;

  @IsString()
  @IsOptional()
  minOrder: string;

  @IsString()
  @IsOptional()
  new: string;

  @IsString()
  @IsOptional()
  open: string;
}
