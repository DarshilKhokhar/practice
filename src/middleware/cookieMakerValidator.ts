import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import Container from 'typedi';
import { CookieMakerService } from '../api/cookieMaker/cookieMaker.service';
import { decodeToken } from '../utils/common/jwt';
import { getMessage } from './responseFormattor';

export class CookieMakerValidator implements ExpressMiddlewareInterface {
  protected _cookieMakerService = Container.get(CookieMakerService);
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
          name: 1,
          email: 1,
          restaurantId: 1
        },
        cookieMaker = await this._cookieMakerService.findOne(
          { _id: mongoose.Types.ObjectId(userId) },
          projection
        );
      if (!cookieMaker) {
        return res.status(401).send({
          status: false,
          error: {
            code: 'AUTH-002',
            message: getMessage('AUTH-002', 'error'),
          },
        });
      }
      if (!cookieMaker.restaurantId && (req.route.path !== "/api/v1/restaurant" && req.route.method !== "post" )) {
        return res.status(401).send({
          status: false,
          error: {
            code: 'AUTH-003',
            message: getMessage('AUTH-003', 'error'),
          },
        });
      }
      Object.assign(req, {
        context: { user: cookieMaker },
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
