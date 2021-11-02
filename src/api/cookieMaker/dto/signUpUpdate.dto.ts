import { Type } from "class-transformer";
import {
  IsDefined,
  IsEmail,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";

class SignUp {
  @IsString()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsString()
  accountStatus: string;
}

export class SignUpUpdatePayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => SignUp)
  payload: SignUp;
}
