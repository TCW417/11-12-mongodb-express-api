'use strict';

import logger from '../logger';

export default (request, response, next) => {
  logger.log(logger.INFO, `${new Date().toISOString()}: Processing ${request.method} request from ${request.url}`);
  next();
};
