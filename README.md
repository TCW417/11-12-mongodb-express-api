![CF](https://camo.githubusercontent.com/70edab54bba80edb7493cad3135e9606781cbb6b/687474703a2f2f692e696d6775722e636f6d2f377635415363382e706e67) 13: Two-Resource Resource Mongo and Express API
===

[![Build Status](https://travis-ci.org/TCW417/13-14-two-resource-api.svg?branch=master)](https://travis-ci.org/TCW417/13-14-two-resource-api)

The BOOKS api provides an interface to a database of books and authors. Think of it as your personal reading list.  Books have, at a minimum, title and author ID, with an optional description. Authors have firstName and lastName properties as well as a database-maintained list of books they've authored.

In order to create (POST) a book you must first have POSTed its author and recorded his/her author._id.

MongoDB is used to provide persistent storage for books data.

## The API

### POST api/read/author

Creates a new author and adds them to the database.

The body of the POST request should be a JSON string with the following information (for example):
```
{
    "firstName":"Larry",
    "lastName":"McMurtry"
}
```
On success, the server will respond with an author document:
```
{
    "authored": [],
    "_id": "5b352191b266e84f67dafcf0",
    "firstName": "Larry",
    "lastName": "McMurtry",
    "createdAt": "2018-06-28T17:57:37.719Z",
    "updatedAt": "2018-06-29T00:01:53.477Z",
    "__v": 5
}
```
Save that _id as you'll need it in order to add Larry's books to the database.

If the request body is missing either firstName or lastName properties a 400 status will be returned.

### POST api/read/book

Creates a new book and adds it to the database.

This route requires a valid book object as a JSON string in the body of the message. For example:
```
{
    "title":"Lonesome Dove",
    "author":"5b352191b266e84f67dafcf0",
    "description":"The description is optional, but Lonesome Dove is a great book!",
    "format":"hardcover"
}
```
Format may be one of "hardcover", "paperback" or "ebook".
Returns status 200 and the full book object, including _id and createdOn properties, as JSON on success. For example:
```
{
    "format": "hardcover",
    "_id": "5b357bdbf8b7f86f1abb05ca",
    "title": "Lonesome Dove",
    "author": "5b352191b266e84f67dafcf0",
    "createdAt": "2018-06-29T00:22:51.778Z",
    "updatedAt": "2018-06-29T00:22:51.778Z",
    "__v": 0
}
```
Returns 400 if no title and/or author are provided. These are required values. Retures 409 if the book title already exists.

### GET api/read/author[/id]
### GET api/read/book[/id]

Returns JSON string representing either a single book [author] if /id is provided or an array of books [authors] if no id is provided. If the database is empty returns an empty array.

Sample return, single object from /book/:
```
{
    "format": "hardcover",
    "_id": "5b357bdbf8b7f86f1abb05ca",
    "title": "Cadillac Jack",
    "author": {
        "authored": [
            "5b3521afb266e84f67dafcf1",
            "5b3521bab266e84f67dafcf3",
            "5b357073c4dd7f6aca4c8ab1",
            "5b35717e553f936b19dcc66c",
            "5b3576f1d4e3a66d1c07f3c1",
            "5b357bdbf8b7f86f1abb05ca"
        ],
        "_id": "5b352191b266e84f67dafcf0",
        "firstName": "Larry",
        "lastName": "McMurtry",
        "createdAt": "2018-06-28T17:57:37.719Z",
        "updatedAt": "2018-06-29T00:22:51.806Z",
        "__v": 6
    },
    "createdAt": "2018-06-29T00:22:51.778Z",
    "updatedAt": "2018-06-29T00:22:51.778Z",
    "__v": 0
}
```
Sample return from GET call to api/read/book with no id:
```
[
    {
        "format": "hardcover",
        "_id": "5b35766bd4e3a66d1c07f3bd",
        "title": "Lonesome Dove",
        "author": "5b352191b266e84f67dafcf0",
        "createdAt": "2018-06-28T23:59:39.603Z",
        "updatedAt": "2018-06-28T23:59:39.603Z",
        "__v": 0
    },
    {
        "format": "hardcover",
        "_id": "5b357bdbf8b7f86f1abb05ca",
        "title": "Cadillac Jack",
        "author": "5b352191b266e84f67dafcf0",
        "createdAt": "2018-06-29T00:22:51.778Z",
        "updatedAt": "2018-06-29T00:22:51.778Z",
        "__v": 0
    }
]
```
Returns status 200 on success, 404 if book ID is not found.

### PUT api/read/book/Id
### PUT api/read/author/Id
This route updates an existing book [author]. It requires a complete book [author] object as a JSON string as the message body, INCLUDING the _id property, as it will use that _id to locate the resource being updated.

For example, if the following object is retrieved from a previous GET request to /api/read/book
```
{
    "format": "hardcover",
    "_id": "5b357bdbf8b7f86f1abb05ca",
    "title": "Lonesome Dove",
    "author": "5b352191b266e84f67dafcf0",
    "createdAt": "2018-06-29T00:22:51.778Z",
    "updatedAt": "2018-06-29T00:22:51.778Z",
    "__v": 0
}
```
and then modified like this
```
{
    "_id": "5b318dc655a74c8526bbffe9",
    "title": "Lonesome Dove",
    "author": "Larry McMurtry",
    "description": "THE BEST BOOK EVER. SERIOUSLY, OF ALL TIME!!!! At least the best western ever.",
    "__v": 0
},
```
the PUT call will succeed and return status 200 with the updated book object as the body of the reply.

If the id isn't found, status 404 will be returned. 400 will be return if id is missing, if body is empty or if properties are in the request body that aren't in the Book schema (title, author, description).  Will return 409 if the title isn't unique.

### DELETE api/read/book/Id
### DELETE api/read/author/Id
Deletes the book with the given Id. The Id would typically be taken from a previous GET call.  

On success, returns staus 204.

400 is returned if the book Id is not provided, 404 if the Id is not found.
