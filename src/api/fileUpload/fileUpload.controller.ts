import { Body, JsonController, Post, Res } from "routing-controllers";
import Container from "typedi";
import { IExtendedResponse } from "../../common/common-types";
import { UPLOAD_FILE } from "../../constants/common";
import UploadFile from "../../utils/aws/upload";
import { FileUploadPayload } from "./dto/fileUpload.dto";
import { AWS_ENDPINT_URL } from "../../config";
import { v4 as uuidv4 } from "uuid";

@JsonController("/upload")
export default class FileUploadController {
  protected _upload: UploadFile;

  constructor() {
    this._upload = Container.get(UploadFile);
  }

  @Post("/file", { transformRequest: true })
  async fileUpload(
    @Res() res: IExtendedResponse,
    @Body() body: FileUploadPayload
  ) {
    try {
      const { uploadType, extension, contentType } = body.payload;
      if (UPLOAD_FILE.UPLOAD_TYPE.indexOf(uploadType) < 0)
        return res.formatter.error({}, false, "INVALID_UPLOAD_TYPE");

      const fileName = uuidv4() + `.${extension}`;
      const fileUrl = `${AWS_ENDPINT_URL}${UPLOAD_FILE[uploadType].path}${fileName}`;
      const AWSSignedUrl = await Promise.all([
        this._upload.uploadToS3(fileName, uploadType, contentType),
        //this._upload.save(dataTosave),
      ]);
      return res.formatter.ok({ AWSSignedUrl, fileUrl }, true, "SIGNED_URL");
    } catch (err) {
      return res.formatter.error({}, false, "FILE_UPLOAD_ERROR", err as Error);
    }
  }
}
