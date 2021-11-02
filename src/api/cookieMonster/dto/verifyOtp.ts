import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNumber,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class VerifyOtp {
  @IsNumber()
  @IsDefined()
  mobileNumber: number;

  @IsNumber()
  @IsDefined()
  otp: number;

  @IsDefined()
  @IsString()
  userId: string;
}

export class VerifyOtpPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => VerifyOtp)
  payload: VerifyOtp;
}
