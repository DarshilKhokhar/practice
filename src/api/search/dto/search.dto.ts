import { Type } from 'class-transformer';
import {
  IsDefined,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class Search {
  @IsString()
  @IsDefined()
  value: string;
}

export class SearchPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => Search)
  payload: Search;
}
