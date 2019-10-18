import 'dotenv/config';

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import Youch from 'youch';

// capture async errors from express
import 'express-async-errors';

import indexRouter from './routes/index';
import sessionsRouter from './routes/sessions';
import usersRouter from './routes/users';
import studentsRouter from './routes/students';
import plansRouter from './routes/plans';
import enrollmentsRouter from './routes/enrollments';
import helpOrdersRouter from './routes/helpOrders';

import authMiddleware from './app/middlewares/auth';

// database connections
import './database';

class App {
  constructor() {
    // create server
    this.server = express();

    // load middlewares and routes
    this.middlewares();
    this.routes();
    this.exceptionHandler();

    // configure paths
    this.configurePaths();
  }

  middlewares() {
    this.server.use(logger('dev'));
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(cookieParser());
  }

  routes() {
    // ===================
    // unauthorized routes
    // ===================
    this.server.use('/', indexRouter);
    this.server.use('/sessions', sessionsRouter);

    // ==============================================
    // mixed routes - authorization inside the router
    // ==============================================
    this.server.use('/users', usersRouter);

    // =================
    // authorized routes
    // =================
    this.server.use(authMiddleware);
    this.server.use('/students', studentsRouter);
    this.server.use('/plans', plansRouter);
    this.server.use('/enrollments', enrollmentsRouter);
    this.server.use('/help-orders', helpOrdersRouter);
  }

  configurePaths() {
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, 'app', 'views', 'images'))
    );
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const error = await new Youch(err, req).toJSON();
        return res.status(500).json(error);
      }
      return res.status(500).json({ error: 'Internal server error.' });
    });
  }
}

export default new App().server;
