import jwt from 'jsonwebtoken';
import 'dotenv/config';

import AppError from '@shared/exceptions/AppError';
import { NextFunction, Request, Response } from 'express';

interface ITokenPayload {
  sub: string;
  iat: number;
  exp: number;
}

interface ITokenPayloadSubject {
  invalidTime: number;
  experiencePoints: number;
  password: string;
  user_id: string;
}

export default function useExperienceTokenMiddleware(
  request: Request, response: Response, next: NextFunction,
): void {
  const { token } = request.body;

  if (!token) {
    throw new AppError('Missing experience token', 401);
  }

  try {
    const { sub } = jwt.verify(
      token, process.env.JWT_SECRET as string,
    ) as ITokenPayload;

    const subject = JSON.parse(sub) as ITokenPayloadSubject;

    if (subject.invalidTime > Date.now()) {
      throw new AppError('Token still invalid');
    }

    request.experience = {
      points: subject.experiencePoints,
      user_id: subject.user_id,
      password: subject.password,
    };

    next();
  } catch (err) {
    throw new AppError(err.message, 401);
  }
}
