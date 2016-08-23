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

function getBooks() {
  return Books();
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

function getBooks(ids) {
  return Books().whereIn('id', ids);
}

function getAuthorBooks(authorId) {
  return Authors_Books().where('author_id', authorId).pluck('book_id')
    .then(function (bookIds) {
      return getBooks(bookIds);
    }).then(function (books) {
      return Authors().where('id', authorId).first().then(function (author) {
        return {
          author: author,
          books: books
        }
      })
    })
}

function getBookAuthors(book) {
  // your code here
}


module.exports = {
  getAuthorBooks: getAuthorBooks,
  getBookAuthors: getBookAuthors,
  getBooks: getBooks
}
