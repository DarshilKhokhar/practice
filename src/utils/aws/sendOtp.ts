import AWS, { SNS } from "aws-sdk";
import { Service } from "typedi";
import { AWS_CREDENTIALS } from "../../config";

@Service()
export default class SendOtp {
  async sendOtpToMobile(mobileNumber: string, otp: number) {
    const params: SNS.Types.PublishInput = {
      Message: `Welcome to the TakeIn. Your verification code for the sign-up is ${otp}. It will expire after 5 minutes.`,
      PhoneNumber: mobileNumber,
      Subject: 'Test subject'
    };
    AWS.config.update({ 
        accessKeyId: AWS_CREDENTIALS.AWS_ACCESS_KEY,
        secretAccessKey: AWS_CREDENTIALS.AWS_SECRET_KEY,
        region: AWS_CREDENTIALS.AWS_REGION,
        signatureVersion: 'v4'
    });
    return new AWS.SNS({
      apiVersion: "2010–03–31",
    })
      .publish(params)
      .promise();
  }
}
