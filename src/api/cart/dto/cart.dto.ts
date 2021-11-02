import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class ItemDetails {
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

class Cart {
  @IsNumber()
  @IsDefined()
  quantity: number;

  @IsDefined()
  choices: [string];

  @IsOptional()
  extras: ItemDetails;

  @IsString()
  @IsOptional()
  additionalComments: string;

  @IsBoolean()
  @IsOptional()
  isOrdered: boolean

  @IsDefined()
  @IsString()
  menuItemId: string;
}

export class CartPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => Cart)
  payload: Cart;
}
