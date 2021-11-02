import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  ValidateNested,
} from 'class-validator';

class Cart {
  @IsNumber()
  @IsDefined()
  quantity: number;
}

export class CartItemUpdatePayload {
  @ValidateNested({ each: true })
  @IsObject()
  @IsOptional()
  @Type(() => Cart)
  payload: Cart;
}

