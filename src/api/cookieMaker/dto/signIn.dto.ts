import { Type } from "class-transformer";
import {
  IsDefined,
  IsEmail,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";

class SignIn {
  @IsEmail()
  @IsDefined()
  email: string;

  @IsDefined()
  @IsString()
  password: string;
}

export class SignInPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => SignIn)
  payload: SignIn;
}
