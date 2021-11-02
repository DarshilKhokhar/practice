import { Type } from 'class-transformer';
import {
  IsDefined,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class HomeBanner {
  @IsString()
  @IsDefined()
  title: string;

  @IsString()
  @IsDefined()
  description: string;

  @IsString()
  @IsDefined()
  backgroundImage: string;

  @IsString()
  @IsDefined()
  keyword: string;
}

export class HomeBannerPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => HomeBanner)
  payload: HomeBanner;
}
