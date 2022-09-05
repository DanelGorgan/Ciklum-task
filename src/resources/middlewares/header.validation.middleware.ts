import {
  Injectable,
  NestMiddleware,
  NotAcceptableException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HeaderValidationMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers?.accept === 'application/xml') {
      return next(new NotAcceptableException());
    }
    if (req.headers?.['swagger-accept'] === 'application/xml') {
      return next(new NotAcceptableException());
    }
    next();
  }
}
