import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Location {
  @IsOptional()
  @IsString()
  type: string;

  @IsArray()
  coordinates: [];
}

class Address {
  @IsString()
  @IsDefined()
  nickName: string;

  @IsString()
  @IsDefined()
  addressLine1: string;

  @IsString()
  @IsDefined()
  addressLine2: string;

  @IsDefined()
  @IsNumber()
  phoneNumber: number;

  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => Location)
  location: Location;

  @IsOptional()
  @IsBoolean()
  isDefault: boolean;
}

class CookieMonsterAddress {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => Address)
  address: Address;
}

export class CookieMonsterAddressPayload {
  @IsObject()
  @Type(() => CookieMonsterAddress)
  payload: CookieMonsterAddress;
}
