'use strict';

// import mongoose from 'mongoose';
// import pgp from 'pg-promise';
const pgp = require('pg-promise')();

const conString = 'postgres://localhost:5432/lab42';
// const client = pgp(conString);
export const client = pgp(conString);
// client.connect();
// client.on('error', (error) => {
//   console.error(error);
// });

// const bookSchema = mongoose.Schema({
//   title: {
//     type: String,
//     required: true,
//     unique: true,
//   },
//   author: {
//     type: String,
//     required: true,
//   },
//   description: {
//     type: String,
//     minlength: 10,
//   },
//   createdOn: {
//     type: Date,
//     default: () => new Date(),
//   },
// });

// Ran into a bug coding this, followed instructions on this stackoverflow page:
// https://stackoverflow.com/questions/50687592/jest-and-mongoose-jest-has-detected-opened-handles
// the first arg of mongoose.model is the name of your collection
// const skipInit = process.env.NODE_ENV === 'development';
// export default mongoose.model('books', bookSchema, 'books', skipInit);

export const createDbTable = () => {
  return client.query(`
    CREATE TABLE IF NOT EXISTS
    books (
      book_id SERIAL PRIMARY KEY,
      title VARCHAR(255) UNIQUE NOT NULL,
      author VARCHAR(255) NOT NULL,
      description VARCHAR(255),
      "createdOn" DATE
    );`)
    .catch((err) => {
      console.error(err);
    });
};

// export default createDbTable;
