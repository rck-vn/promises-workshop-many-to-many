var express = require('express');
var router = express.Router();
var knex = require('../db/knex');
var helpers = require('../lib/helpers')

function Books() {
  return knex('books');
}

function Authors_Books() {
  return knex('authors_books');
}

  function Authors() {
  return knex('authors');
}

router.get('/', function(req, res, next) {
  Books().then(function(books){
    return Promise.all(books.map(function(book){
      return helpers.getBookAuthors(book).then(function(authors){
        book.authors = authors
        return book
      })
    })).then(function(){
      res.render('books/index',{
        books: books
      })
    })

    })
  })
  // find the book in Books
  // get all of the books author_ids from Authors_Books
  // get all of the books authors from Authors
  // render the corresponding template
  // use locals to pass books and author to the view
  // CHECK YOU WORK by visiting /books/406


router.get('/new', function(req, res, next) {
  res.render('books/new');
});

router.post('/', function (req, res, next) {
  var errors = [];
  if(!req.body.title.trim()){errors.push("Title cannot be blank")}
  if(!req.body.genre.trim()){errors.push("Genre cannot be blank")}
  if(!req.body.cover_url.trim()){errors.push("Cover image cannot be blank")}
  if(!req.body.description.trim()){errors.push("Description cannot be blank")}
  if(errors.length){
    res.render('books/new', { book: req.body, errors: errors })
  } else {
    Books().insert(req.body).then(function (results) {
        res.redirect('/');
    })
  }
})

router.get('/:id/delete', function(req, res, next) {
  Books().where('id',req.params.id).first().then(function(book){
   helpers.getBookAuthors(book).then(function(authors){
     res.render('books/delete',{
       authors: authors,
       book: book,
       author_books: authors
     })
   })
  })
  // CHECK YOUR WORK by visiting /books/406/delete
});

router.post('/:id/delete', function(req, res, next) {
  Books().where('id', req.params.id).del().then(function (book) {
    res.redirect('/books');
  })
});

router.get('/:id/edit', function(req, res, next) {
  Books().where('id', req.params.id).first().then(function (book) {
    res.render('books/edit', {book: book});
  })
});

router.get('/:id', function(req, res, next) {
  Books().where('id',req.params.id).first().then(function(book){
   helpers.getBookAuthors(book).then(function(authors){
     res.render('books/show',{
       authors: authors,
       book: book,
       author_books: authors
     })
   })
  })
  // get all of the authors book_ids from Authors_Books
  // get all of the authors books from BOOKs
  // render the corresponding template
  // use locals to pass books and author to the view
  // CHECK YOU WORK by visiting /authors/406
  // CHECK YOUR WORK by visiting /books/406
});

router.post('/:id', function(req, res, next) {
  var errors = [];
  if(!req.body.title.trim()){errors.push("Title cannot be blank")}
  if(!req.body.genre.trim()){errors.push("Genre cannot be blank")}
  if(!req.body.cover_url.trim()){errors.push("Cover image cannot be blank")}
  if(!req.body.description.trim()){errors.push("Description cannot be blank")}
  if(errors.length){
    res.render('books/edit', { book: req.body, errors: errors })
  } else {
    Books().where('id', req.params.id).update(req.body).then(function (results) {
      res.redirect('/');
    })
  }
});

module.exports = router;
