import { Type } from "class-transformer";
import {
  IsDefined,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";

class ChangePassword {
  @IsDefined()
  @IsString()
  currentPassword: string;

  @IsDefined()
  @IsString()
  newPassword: string;

  @IsDefined()
  @IsString()
  repeatNewPassword: string;
}

export class ChangePasswordPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => ChangePassword)
  payload: ChangePassword;
}
