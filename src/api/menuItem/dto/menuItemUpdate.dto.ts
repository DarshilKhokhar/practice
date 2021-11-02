import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class Itemupdate {
  @IsString()
  @IsDefined()
  name: string;

  @IsNumber()
  @IsDefined()
  calories: number;

  @IsNumber()
  @IsDefined()
  amount: number;
}

class ItemDetails {
  @IsOptional()
  @IsArray()
  choices: [string];

  @IsOptional()
  @IsObject()
  @IsArray()
  extras: Itemupdate;
}

class MenuItem {
  @IsString()
  @IsOptional()
  name: string;

  @IsOptional()
  @IsNumber()
  calories: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  image: string;

  @IsBoolean()
  @IsOptional()
  isAvailable: boolean;

  @IsOptional()
  @IsObject()
  itemDetails: ItemDetails

  @IsOptional()
  @IsString()
  menuCategoryId: [string];
}

export class MenuItemUpdatePayload {
  @ValidateNested({ each: true })
  @IsObject()
  @IsOptional()
  @Type(() => MenuItem)
  payload: MenuItem;
}
