import AWS, { S3 } from "aws-sdk";
import { Service } from "typedi";
import { AWS_CREDENTIALS } from "../../config";
import { UPLOAD_FILE } from "../../constants/common";

@Service()
export default class UploadFile {
  private s3Client: S3;

  constructor() {
    this.s3Client = new AWS.S3({
      accessKeyId: AWS_CREDENTIALS.AWS_ACCESS_KEY,
      secretAccessKey: AWS_CREDENTIALS.AWS_SECRET_KEY,
      region: AWS_CREDENTIALS.AWS_REGION,
    });
  }

  public async uploadToS3(
    fileName: string,
    uploadType: string,
    contentType: string
  ) {
    const uploadParams = {
      Bucket: AWS_CREDENTIALS.S3_BUCKET,
      Key: `${UPLOAD_FILE[uploadType].path}${fileName}`,
      Expires: UPLOAD_FILE[uploadType].expireTime,
      ContentType: contentType,
      //ACL: 'public-read',
    };
    return new Promise((resolve, reject) => {
      this.s3Client.getSignedUrl("putObject", uploadParams, (err, url) => {
        if (err) reject(err);
        resolve(url);
      });
    });
  }
}
