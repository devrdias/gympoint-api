import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import indexRouter from './routes/index';
import usersRouter from './routes/users';

class App {
  constructor() {
    // create server
    this.server = express();

    // configure server
    this.server.use(logger('dev'));
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(cookieParser());
    this.server.use(express.static(path.join(__dirname, 'public')));

    // load middlewares and routes
    this.middlewares();
    this.routes();
  }

  middlewares() {}

  routes() {
    this.server.use('/', indexRouter);
    this.server.use('/users', usersRouter);
  }
}

export default new App().server;
