'use strict';

import logger from '../logger';

export default (err, request, response, next) => {
  const source = 'ERROR Handler:';
  if (err.status) {
    logger.log(logger.ERROR, `${source} ${request.method}: responding with ${err.status} status code: ${err.message}`);
    return response.sendStatus(err.status);
  }

  if (err.message.toLowerCase().includes('cast to objectid failed')) {
    logger.log(logger.ERROR, `${source} ${request.method}: responding with 404 status code to mongdb error, objectId ${request.params.id} failed, ${err.message}`);
    return response.sendStatus(404);
  }

  // a required property was not included, i.e. in this case, "title"
  if (err.message.toLowerCase().includes('validation failed')) {
    logger.log(logger.ERROR, `${source} ${request.method}: responding with 400 status code for bad request ${err.message}`);
    return response.sendStatus(400);
  }
  // we passed in a title that already exists on a resource in the db because in our Note model, we set title to be "unique"
  if (err.message.toLowerCase().includes('duplicate key')) {
    logger.log(logger.ERROR, `${source} ${request.method}: responding with 409 status code for dup key ${err.message}`);
    return response.sendStatus(409);
  }

  // if we hit here, something else not accounted for occurred
  logger.log(logger.ERROR, `${source} ${request.method}: 500 status code for unaccounted error ${JSON.stringify(err)}`);
  next(); // should just return...
  return response.sendStatus(500); // Internal Server Error
};
