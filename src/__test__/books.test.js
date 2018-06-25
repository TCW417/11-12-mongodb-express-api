'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Book from '../model/book';
import { startServer, stopServer } from '../lib/server';

const apiUrl = `http://localhost:${process.env.PORT}/api/v1/books`;

// this will be a helper function mock out resources to create test items that will actually be in the Mongo database

const createBookMockPromise = () => {
  return new Book({
    title: faker.lorem.words(3),
    author: faker.name.findName(),
    description: faker.lorem.words(20),
  }).save();
  // .save is a built-in method from mongoose to save/post 
  // a new resource to our actual Mongo database and it returns a promise
};

beforeAll(startServer);
afterAll(stopServer);

// ".remove" is a built-in mongoose schema method 
// that we use to clean up our test database entirely 
// of all the mocks we created so we can start fresh with every test block
afterEach(() => Book.remove({}));

describe('POST requests to /api/v1/books', () => {
  test('POST 200 for successful creation of book', () => {
    const mockBookToPost = {
      title: faker.lorem.words(3),
      author: faker.name.findName(),
      description: faker.lorem.words(20),
    };
    return superagent.post(apiUrl)
      .send(mockBookToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(mockBookToPost.title);
        expect(response.body.description).toEqual(mockBookToPost.description);
        expect(response.body.author).toEqual(mockBookToPost.author);
        expect(response.body._id).toBeTruthy();
        expect(response.body.createdOn).toBeTruthy();
      })
      .catch((err) => {
        throw err;
      });
  });

  test('POST 400 for not sending in a required TITLE property', () => {
    const mockBookToPost = {
      author: faker.name.findName(),
      description: faker.lorem.words(50),
    };
    return superagent.post(apiUrl)
      .send(mockBookToPost)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  test('POST 400 for not sending in a required AUTHOR property', () => {
    const mockBookToPost = {
      title: faker.lorem.words(3),
      description: faker.lorem.words(50),
    };
    return superagent.post(apiUrl)
      .send(mockBookToPost)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(400);
      });
  });

  test('POST 409 for duplicate key', () => {
    return createBookMockPromise()
      .then((newBook) => {
        return superagent.post(apiUrl)
          .send({ title: newBook.title, author: newBook.author })
          .then((response) => {
            throw response;
          })
          .catch((err) => {
            expect(err.status).toEqual(409);
          });
      })
      .catch((err) => {
        throw err;
      });
  });
});

describe('GET requests to /api/v1/books', () => {
  test('200 GET for succesful fetching of a book', () => {
    let mockBookForGet;
    return createBookMockPromise()
      .then((book) => {
        mockBookForGet = book;
        // I can return this to the next then block because superagent requests are also promisfied
        return superagent.get(`${apiUrl}/${mockBookForGet._id}`);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.title).toEqual(mockBookForGet.title);
        expect(response.body.author).toEqual(mockBookForGet.author);
      })
      .catch((err) => {
        throw err;
      });
  });

  test('404 GET: no book with this id', () => {
    return superagent.get(`${apiUrl}/THISISABADID`)
      .then((response) => {
        throw response;
      })
      .catch((err) => {
        expect(err.status).toEqual(404);
      });
  });
});

describe('PUT request to /api/v1/books', () => {
  test('200 PUT for successful update of a resource', () => {
    return createBookMockPromise()
      .then((newBook) => {
        return superagent.put(`${apiUrl}/${newBook._id}`)
          .send({ title: 'updated title', description: 'updated book description.' })
          .then((response) => {
            expect(response.status).toEqual(200);
            expect(response.body.title).toEqual('updated title');
            expect(response.body.description).toEqual('updated book description.');
            expect(response.body._id.toString()).toEqual(newBook._id.toString());
          })
          .catch((err) => {
            throw err;
          });
      })
      .catch((err) => {
        throw err;
      });
  });
});