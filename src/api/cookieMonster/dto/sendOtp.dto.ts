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

class SendOtp {
  @IsNumber()
  @IsDefined()
  mobileNumber: number;

  @IsString()
  @IsDefined()
  countryCode: string;

  @IsBoolean()
  @IsOptional()
  isEdit: boolean;

  @IsOptional()
  @IsString()
  id: string;
}

export class SendOtpPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => SendOtp)
  payload: SendOtp;
}
