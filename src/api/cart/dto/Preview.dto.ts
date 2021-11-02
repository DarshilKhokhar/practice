import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';


export class Preview {
  @IsOptional()
  @IsNumber()
  amount: number

  @IsOptional()
  @IsNumber()
  quantity: number
}

