import { NextFunction, Request, Response } from 'express';
import jwt, { JsonWebTokenError } from 'jsonwebtoken';
import 'dotenv/config';

import AppError from '@shared/exceptions/AppError';

interface ITokenPayload {
  exp: number;
  iat: number;
  sub: string;
}

export default function ensureAuthenticatedMiddleware(
  request: Request, response: Response, next: NextFunction,
): void {
  const authenticationHeader = request.headers.authorization;

  if (!authenticationHeader) {
    throw new AppError('Missing JWT token', 401);
  }

  const [, token] = authenticationHeader.trim().split(' ');

  try {
    const { sub } = jwt.verify(
      token, process.env.JWT_SECRET as string,
    ) as ITokenPayload;

    request.user = {
      id: sub,
    };

    next();
  } catch (err) {
    const jwtError: JsonWebTokenError = err;

    throw new AppError(jwtError.message, 401);
  }
}
