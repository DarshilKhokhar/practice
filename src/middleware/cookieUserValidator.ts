import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import Container from 'typedi';
import { CookieMonsterService } from '../api/cookieMonster/cookieMonster.service';
import { decodeToken } from '../utils/common/jwt';
import { getMessage } from './responseFormattor';

export class CookieUserValidator implements ExpressMiddlewareInterface {
  protected _cookieMonseterService = Container.get(CookieMonsterService);
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const accessToken = req.headers.authorization || req.body.authorization,
        token = accessToken.slice(7);
      if (!accessToken) {
        return res.status(401).send({
          status: false,
          error: {
            code: 'AUTH-001',
            message: getMessage('AUTH-001', 'error'),
          },
        });
      }
      const decodedData = await decodeToken(token);
      if (!decodedData?.userId) {
        return res.status(401).send({
          status: false,
          error: {
            code: 'AUTH-002',
            message: getMessage('AUTH-002', 'error'),
          },
        });
      }
      const { userId } = decodedData,
        projection = {
          email: 1,
          mobileNumber: 1,
          firstName: 1,
          signUpCompleted: 1,
        },
        cookieUser = await this._cookieMonseterService.findOne(
          { _id: mongoose.Types.ObjectId(userId) },
          projection
        );
      if (!cookieUser) {
        return res.status(401).send({
          status: false,
          error: {
            code: 'AUTH-002',
            message: getMessage('AUTH-002', 'error'),
          },
        });
      }
      Object.assign(req, {
        context: { user: cookieUser },
      });
      next();
    } catch (err) {
      console.log('Error while decoding token:::', err);
      return res.status(401).send({
        status: false,
        error: {
          code: 'AUTH-002',
          message: getMessage('AUTH-002', 'error'),
        },
      });
    }
  }
}
