var Promise = require('bluebird');
var knex = require('../db/knex');

function Authors() {
  return knex('authors');
}

function Books(){
  return knex('books');
}

function Authors_Books() {
  return knex('authors_books');
}

function prepIds(ids) {
  return ids.filter(function (id) {
    return id !== '';
  })
}

function insertIntoAuthorsBooks(bookIds, authorId) {
  bookIds = prepIds(bookIds);
  return Promise.all(bookIds.map(function (book_id) {
    book_id = Number(book_id)
    return Authors_Books().insert({
      book_id: book_id,
      author_id: authorId
    })
  }))
}

function getAuthorBooks(authorId) {
  return Authors_Books().where('author_id', authorId).pluck('book_id')
    .then(function (bookIds) {
      return Books().whereIn('id', bookIds);
    }).then(function (books) {
      return Authors().where('id', authorId).first().then(function (author) {
        author.books = books;
        return author;
      })
    })
}

function getAuthorsAndBooks(){
  return Authors().then(function (authors) {
    return Promise.all(authors.map(function (author) {
      return getAuthorBooks(author.id)
    }))
  }).then(function (authorsWithBooks) {
    return authorsWithBooks;
  })
}

function getBookAuthors(book) {
  // your code here
}


module.exports = {
  getAuthorBooks: getAuthorBooks,
  getBookAuthors: getBookAuthors,
  getAuthorsAndBooks: getAuthorsAndBooks
}
