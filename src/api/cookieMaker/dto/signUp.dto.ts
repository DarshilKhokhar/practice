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
  @IsDefined()
  name: string;

  @IsEmail()
  @IsDefined()
  email: string;

  @IsDefined()
  @IsString()
  password: string;
}

export class SignUpPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => SignUp)
  payload: SignUp;
}
