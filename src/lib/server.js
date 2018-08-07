'use strict';

import express from 'express';
// import mongoose from 'mongoose';
// import pgp from 'pg-promise';
import bodyParser from 'body-parser';

import logger from './logger';
import loggerMiddleware from './middleware/logger-middleware';
import bookRouter from '../router/book-router';
import errorMiddleware from './middleware/error-middleware';

const app = express();
const PORT = process.env.PORT || 3000;
// const conString = 'postgres://localhost:5432/lab42';
let server;

// const client = pgp(conString);
// client.connect();
// client.on('error', (error) => {
//   console.error(error);
// });

app.use(loggerMiddleware);

app.use(bodyParser.json());

app.use(bookRouter);

app.use(errorMiddleware);

app.all('*', (request, response) => {
  logger.log(logger.INFO, 'SERVER: Returning a 404 from the catch-all/default route');
  return response.status(404).send('Route Not Registered');
});

// const startServer = () => {
//   return mongoose.connect(process.env.MONGODB_URI)
//     .then(() => {
//       server = app.listen(PORT, () => {
//         logger.log(logger.INFO, `Server is listening on PORT ${PORT}`);
//       });
//     })
//     .catch((err) => {
//       throw err;
//     });
// };
const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}!`);
  });
};

// const stopServer = () => {
//   return mongoose.disconnect()
//     .then(() => {
//       server.close(() => {
//         logger.log(logger.INFO, 'Server is off');
//       });
//     })
//     .catch((err) => {
//       throw err;
//     });
// };
const stopServer = () => {
  server.close(() => { logger.log(logger.INFO, 'Server is off'); });
};

export { startServer, stopServer };
