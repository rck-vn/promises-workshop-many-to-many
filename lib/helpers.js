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

function getAuthorBooks(author) {
  return Authors_Books().where('author_id', author.id).pluck('book_id').then(function (bookIds){
    console.log("**********");
    console.log(bookIds);
      return Books().whereIn('id', bookIds).then(function(books){
        return books
      })
    })
  // your code here
}

function getBookAuthors(book) {
  return Authors_Books().where('book_id', book.id).pluck('author_id').then(function (authorIds){

      return Authors().whereIn('id', authorIds).then(function(authors){
        return authors
      })
    })
  // opposite of get books
  // your code here
}


module.exports = {
  getAuthorBooks: getAuthorBooks,
  getBookAuthors: getBookAuthors
}
