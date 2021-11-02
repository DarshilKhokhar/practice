require('dotenv').config();
export const PORT = process.env.PORT || 3000;
export const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/takein';
export const MONGO_CONFIG = {
  poolSize: parseInt(process.env.MONGO_POOL_SIZE || '5')
};

export const AWS_ENDPINT_URL = process.env.AWS_ENDPINT_URL || 'https://takein.s3.ap-southeast-1.amazonaws.com';

export const AWS_CREDENTIALS = {
  AWS_ACCESS_KEY: process.env.AWS_ACCESS_KEY || 'AKIAV7G6OVJHCHLRCRHZ',
  AWS_SECRET_KEY: process.env.AWS_SECRET_KEY || '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',
  AWS_REGION: process.env.AWS_REGION || 'ap-southeast-1',
  S3_BUCKET: process.env.S3_BUCKET || 'takein'
};

// VAT Charges for Bill Payment.
export const VATCharge = 20;

export const JWT_SECRET = 'afsjhgu53h252efbbi';
