import { Type } from 'class-transformer';
import {
  IsDefined,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class FileUpload {
  @IsString()
  @IsDefined()
  uploadType: string;

  @IsString()
  @IsDefined()
  extension: string;

  @IsString()
  @IsDefined()
  contentType: string;
}

export class FileUploadPayload {
  @ValidateNested({ each: true })
  @IsObject()
  @Type(() => FileUpload)
  payload: FileUpload;
}
