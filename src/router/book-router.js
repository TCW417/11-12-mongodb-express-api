'use strict';

import { Router } from 'express';
import Book from '../model/book';

const bookRouter = new Router();

bookRouter.post('/api/v1/books', (request, response, next) => {
  if (!request.body.title || !request.body.author) {
    const err = new Error('POST with no title and/or author provided');
    err.status = 400;
    next(err);
  }

  // I need run the init() method (which returns a promise) on POST and PUT requests because Mongoose is still in the process of indexing fields that I flagged as "unique". If I don't run init() first, I get false positive tests that don't properly catch for 409 conflit errors when duplicate values are posted to the db. 
  Book.init()
    .then(() => {
      return new Book(request.body).save();
    })
    .then((newBook) => {
      return response.json(newBook).status(200);
    })
    .catch(next);
  return undefined;
});

// you need this question mark after ":id" or else Express will skip to the catch-all in lib/server.js 
bookRouter.get('/api/v1/books/:id?', (request, response, next) => {
  if (!request.params.id) {
    return Book.find()
      .then((books) => {
        return response.json(books).status(200);
      })
      .catch(next);
  }
  return Book.findOne({ _id: request.params.id })
    .then((book) => {
      if (!book) {
        const err = new Error(`Book id ${request.params.id} not found`);
        err.status = 404;
        next(err);
      }
      return response.json(book);
    })
    .catch(next);
});

bookRouter.put('/api/v1/books/:id?', (request, response, next) => {
  if (!request.params.id) {
    const err = new Error('No id provided for update');
    err.status = 400;
    next(err);
  }
  
  if (Object.keys(request.body).length === 0) { // empty body
    const err2 = new Error(`Book id ${request.params.id} update without message body`);
    err2.status = 400;
    next(err2);
  }

  // this code shouldn't really be neccesary on a schema with strict mode on (which it 
  // is by default). Strict mode is supposed to prevent properties that aren't in the 
  // schema from being added.  I found, however, that I get a 200 status code back from
  // my test of this condition so I added this to catch it BEFORE I make the call to
  // findByIdAndUpdate as the .catch block isn't taken.
  const schemaKeys = Object.keys(Book.schema.paths);
  const requestKeys = Object.keys(request.body);
  let badBodyKeys = false;
  for (let i = 0; i < requestKeys.length; i += 1) {
    if (!schemaKeys.includes(requestKeys[i])) {
      badBodyKeys = true;
      break;
    }
  }
  if (badBodyKeys) {
    const err3 = new Error(`Book id ${request.params.id} update failed: invalide keys in message body`);
    err3.status = 400;
    next(err3);
  }

  // we need to pass these options into "findByIdAndUpdate" so we can actually return the newly modified document in the promise per "new", and "runValidators" ensures that the original validators we set on the model
  const options = {
    strict: true,
    new: true,
    runValidators: true,
  };


  Book.init()
    .then(() => {
      return Book.findByIdAndUpdate(request.params.id, request.body, options);
    })
    .then((updatedBook) => {
      if (updatedBook) {
        return response.json(updatedBook);
      }
      return undefined;
    })
    .catch(next);
  return undefined;
});

bookRouter.delete('/api/v1/books/:id?', (request, response, next) => {
  if (!request.params.id) {
    const err = new Error('Unable to delete book: no id provided');
    err.status = 400;
    next(err);
  }

  Book.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.sendStatus((result ? 204 : 404));
    })
    .catch(next);

  return undefined;
});

export default bookRouter;
