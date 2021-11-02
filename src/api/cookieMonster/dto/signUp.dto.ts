import { Type } from 'class-transformer';
import {
  IsDefined,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class SignUp {
  @IsString()
  @IsDefined()
  firstName: string;

  @IsString()
  @IsDefined()
  lastName: string;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsDefined()
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  referralCode: string;
}

export class SignUpPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => SignUp)
  payload: SignUp;
}
