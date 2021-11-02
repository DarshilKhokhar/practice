import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class ResendOtp {
  @IsNumber()
  @IsDefined()
  mobileNumber: number;

  @IsDefined()
  @IsString()
  userId: string;
}

export class ResendOtpPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => ResendOtp)
  payload: ResendOtp;
}
