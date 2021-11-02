import { Type } from 'class-transformer';
import {
  IsDefined,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class Order {

  @IsDefined()
  @IsString()
  deliveryType: string;

  @IsDefined()
  @IsString()
  payWith: string;
}

export class OrderPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => Order)
  payload: Order;
}
