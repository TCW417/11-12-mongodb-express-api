![cf](https://i.imgur.com/7v5ASc8.png) 11: Single Resource Express API
======

[![Build Status](https://travis-ci.org/TCW417/11-12-mongodb-express-api.svg?branch=master)](https://travis-ci.org/TCW417/11-12-mongodb-express-api)

The BOOKS api provides an interface to a database of books. Think of it as your personal reading list.  Books have, at a minimum, title and author properties, with an optional description.

MongoDB is used to provide persistent storage for books data.

## The API
### GET api/v1/books[/id]

Returns JSON string representing either a single book (/bookId) or array of books if no ID is provided. If the database is empty returns an empty array.

Sample return, single object from ?id= query:
```
{
    "_id": "5b318e3555a74c8526bbffea",
    "title": "The Name of the Wind",
    "author": "Patrick Rothfuss",
    "description": "Book 1 of an epic fantasy series.",
    "createdOn": "2018-06-26T00:52:05.458Z",
    "__v": 0
}
```
Sample return from GET call to path with title=, author= or no query:
```
[
    {
        "_id": "5b318dc655a74c8526bbffe9",
        "title": "Lonesome Dove",
        "author": "Larry McMurtry",
        "description": "The best book ever. At least the best western ever.",
        "createdOn": "2018-06-26T00:50:14.148Z",
        "__v": 0
    },
    {
        "_id": "5b318e3555a74c8526bbffea",
        "title": "The Name of the Wind",
        "author": "Patrick Rothfuss",
        "description": "Book 1 of an epic fantasy series.",
        "createdOn": "2018-06-26T00:52:05.458Z",
        "__v": 0
    }
]
```
Returns status 200 on success, 404 if book ID is not found.

### POST api/vi/books

Creates a new book and adds it to the database.

This route requires a valid book object as a JSON string in the body of the message. For example:
```
{
    "title":"test title",
    "author":"test author"
}
```
or
```
{
    "title":"test title",
    "author":"test author",
    "description":"This is a description of the book"
}
```
Returns status 200 and the full book object, including _id and createdOn properties, as JSON on success. On success the body of the return includes _id and createdOn properties, as:
```
{
    "_id": "5b318dc655a74c8526bbffe9",
    "title": "Lonesome Dove",
    "author": "Larry McMurtry",
    "description": "The best book ever. At least the best western ever.",
    "createdOn": "2018-06-26T00:50:14.148Z",
    "__v": 0
},
```
Returns 400 if no title and/or author are provided. These are required values.

### PUT api/vi/books/Id
This route updates an existing book. It requires a complete book object as a JSON string as the message body, INCLUDING the _id property, as it will use that _id to locate the resource being updated.

For example, if the following object is retrieved from a previous GET request
```
{
    "_id": "5b318dc655a74c8526bbffe9",
    "title": "Lonesome Dove",
    "author": "Larry McMurtry",
    "description": "The best book ever. At least the best western ever.",
    "createdOn": "2018-06-26T00:50:14.148Z",
    "__v": 0
},
```
and then modified like this
```
{
    "_id": "5b318dc655a74c8526bbffe9",
    "title": "Lonesome Dove",
    "author": "Larry McMurtry",
    "description": "THE BEST BOOK EVER. SERIOUSLY, OF ALL TIME!!!! At least the best western ever.",
    "createdOn": "2018-06-26T00:50:14.148Z",
    "__v": 0
},
```
the PUT call will succeed and return status 200 with the updated book object as the body of the reply.

If the id isn't found, status 404 will be returned. 400 will be return if id is missing, if body is empty or if properties are in the request body that aren't in the Book schema (title, author, description).  Will return 409 if the title isn't unique.

### DELETE api/v1/books/Id
Deletes the book with the given Id. The Id would typically be taken from a previous GET call.  

On success, returns staus 204.

400 is returned if the book Id is not provided, 404 if the Id is not found.