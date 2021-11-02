import CryptoJs from 'crypto';

export const encryptPwd = (password: string): string => {
  return CryptoJs.createHash('sha256').update(password).digest('base64');
}