import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import Youch from 'youch';

import indexRouter from './routes/index';
import sessionsRouter from './routes/sessions';
import usersRouter from './routes/users';
import studentsRouter from './routes/students';
import plansRouter from './routes/plans';

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
  }

  middlewares() {
    this.server.use(logger('dev'));
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(cookieParser());
    this.server.use(express.static(path.join(__dirname, 'public')));
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
  }

  exceptionHandler() {
    console.log('exceptionHandler');
    this.server.use(async (err, req, res, next) => {
      const error = await new Youch(err, req).toJSON();
      console.log('TCL: App -> exceptionHandler -> error', error);
      return res.status(500).json(error);
    });
  }
}

export default new App().server;
