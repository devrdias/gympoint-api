import 'dotenv/config';

import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import Youch from 'youch';
import Arena from 'bull-arena';
import * as Sentry from '@sentry/node';
import arenaConfig from './config/arena';
import sentryConfig from './config/sentry';

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

// Arena-bull queue monitoring
const arena = Arena(arenaConfig.config, arenaConfig.listenOpts);

class App {
  constructor() {
    // create server
    this.server = express();

    // initiate sentry error monitoring
    Sentry.init(sentryConfig);

    // configure PUBLIC paths
    this.configurePaths();

    // load middlewares and routes
    this.middlewares();
    this.routes();

    // custom error handler to return error to client
    this.exceptionHandler();
  }

  middlewares() {
    // The request handler must be the first middleware on the app
    this.server.use(Sentry.Handlers.requestHandler());

    this.server.use(logger('dev'));
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(cookieParser());
  }

  routes() {
    // Make arena's resources (js/css deps) available at the base app route
    this.server.use('/', arena);

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

    // The error handler must be before any other error middleware and after all controllers
    this.server.use(Sentry.Handlers.errorHandler());
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
