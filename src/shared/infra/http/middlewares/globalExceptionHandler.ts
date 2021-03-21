import AppError from '@shared/exceptions/AppError';
import { NextFunction, Request, Response } from 'express';

export default function globalExceptionHandlerMiddleware(
  err: Error, request: Request, response: Response, _next: NextFunction,
): Response {
  if (err instanceof AppError) {
    return response.status(err.statusCode).send({
      status: 'error',
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).send({
    status: 'error',
    message: 'Internal Server Error',
  });
}
