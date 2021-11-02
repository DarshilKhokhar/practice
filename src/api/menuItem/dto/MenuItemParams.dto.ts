import {
  IsOptional,
  IsString,
} from "class-validator";

export class MenuItemParams {
  @IsString()
  @IsOptional()
  menuCategoryId: string;

  @IsOptional()
  @IsString()
  restaurantId: string;

  @IsString()
  @IsOptional()
  search: string
}
