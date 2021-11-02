import jwt from 'jsonwebtoken';
import { ITokenPayload } from '../../common/common-types';
import { JWT_SECRET } from '../../config';

const secretKey = JWT_SECRET;

export const createToken = (payload: ITokenPayload) : Promise<Error | string | undefined> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secretKey, { algorithm: 'HS256' } ,(err, token) => {
      if (err)
        reject(err);
      resolve(token);
    })
  })
}

export const decodeToken = (token: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (err, decodedData) => {
      if (err)
        reject(err);
      resolve(decodedData);
    })
  })
}