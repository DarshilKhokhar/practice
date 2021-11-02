import { Type } from "class-transformer";
import {
  IsDefined,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class orderAgain {
  @IsString()
  @IsDefined()
  orderId: string;
}

export class orderAgainPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @IsOptional()
  @Type(() => orderAgain)
  payload: orderAgain;
}
