import { Type } from "class-transformer";
import {
  IsArray,
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class Item {
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
  @IsDefined()
  @IsArray()
  choices: [string];

  @IsDefined()
  @IsObject()
  @IsArray()
  extras: Item;
}

class MenuItem {
  @IsString()
  @IsDefined()
  name: string;

  @IsOptional()
  @IsNumber()
  calories: number;

  @IsOptional()
  @IsString()
  description: string;

  @IsDefined()
  @IsNumber()
  amount: number;

  @IsDefined()
  @IsString()
  image: string;

  @IsDefined()
  @IsObject()
  itemDetails: ItemDetails

  @IsOptional()
  @IsString()
  menuCategoryId: [string];
}

export class MenuItemPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => MenuItem)
  payload: MenuItem;
}
