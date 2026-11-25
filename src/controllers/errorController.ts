import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';

function handleCastErrorDB(err: any) {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
}

function handleDuplicateFieldsDB(err: any) {
  // Mongoose may wrap the original MongoServerError in `cause`
  const original = err.cause ?? err;
  const value = original.keyValue
    ? Object.values(original.keyValue).join(', ')
    : undefined;
  const message = value
    ? `Duplicate field value: "${value}". Please use another value!`
    : err.message;
  return new AppError(message, 400);
}

function handleValidationErrorDB(err: any) {
  const errors = Object.values(err.errors ?? {}).map(
    (el: any) => el.message as string,
  );
  const message = errors.length
    ? `Invalid input data. ${errors.join('. ')}`
    : err.message;
  return new AppError(message, 400);
}

function isDuplicateKeyError(err: any) {
  return [11000, 11001].includes(err.code ?? err.cause?.code);
}

function sendErrorDev(err: AppError, res: Response) {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProd(err: AppError, res: Response) {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message to client
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
}

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error: AppError = err;
  if (err.name === 'CastError') error = handleCastErrorDB({ ...err });
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, res);
  } else {
    if (isDuplicateKeyError(err)) error = handleDuplicateFieldsDB(err);
    sendErrorProd(error, res);
  }
};
