import { Type } from "class-transformer";
import {
  IsDefined,
  IsObject,
  IsString,
  ValidateNested,
} from "class-validator";

class MenuCategory {
  @IsString()
  @IsDefined()
  categoryName: string;
}

export class MenuCategoryPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => MenuCategory)
  payload: MenuCategory;
}
