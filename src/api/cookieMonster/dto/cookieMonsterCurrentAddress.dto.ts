import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
} from 'class-validator';

class Location {
  @IsArray()
  coordinates: [];
}

export class CookieMonsterCurrentAddressPayload {
  @IsObject()
  @Type(() => Location)
  location: Location;
}
