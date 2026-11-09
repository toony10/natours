import express from 'express';
import morgan from 'morgan';
import { router as tourRouter } from './routes/tourRoutes';
import { router as userRouter } from './routes/userRoutes';
import { AppError } from './utils/appError';
import { globalErrorHandler } from './controllers/errorController';

export const app = express();

// 1) Middlewares
app.use(morgan('dev'));
app.set('query parser', 'extended');
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('/{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${ req.originalUrl } on this server!`, 404));
});

app.use(globalErrorHandler);
