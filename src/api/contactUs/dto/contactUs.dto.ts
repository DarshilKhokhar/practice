import { Type } from "class-transformer";
import {
  IsDefined,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class ContactUs {
  @IsString()
  @IsDefined()
  name: string;

  @IsDefined()
  @IsNumber()
  phoneNumber: number;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsOptional()
  @IsString()
  message: string;
}

export class ContactUsPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => ContactUs)
  payload: ContactUs;
}
