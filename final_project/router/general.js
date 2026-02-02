const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        if (users.filter((u) => {return u.username === username;}).length > 0) {
            res.status(404).send(`Username ${username} already exists`);
        }
        else {
            users.push({
                "username": username,
                "password": password
            });
            res.status(200).send(`New user ${username} has been created`);
        }
        
    }
    else {
        res.status(404).send("Username and password must be provided");
    }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (isbn && books[isbn]) {
        res.status(200).send(JSON.stringify(books[isbn],null,4));
    }
    else {
        res.status(404).send("There is an error with your request");
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    if (author) {
        const booksArray = Object.values(books);
        const book = booksArray.filter((b) => {
            return b.author === author
        }
    );
        if (book.length > 0) {
            res.status(200).send(JSON.stringify({book},null,4));
        }
        else {
            res.status(404).send("No book found for this author");
        }
    }
    else {
        res.status(404).send("No author name");
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    if (title) {
        const booksArray = Object.values(books);
        const book = booksArray.filter((b) => {
            return b.title === title;
        });
        if (book.length > 0) {
            res.status(200).send(JSON.stringify({book},null,4));
        }
        else {
            res.status(404).send("No book has been found");
        }
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (isbn) {
        res.send(books[isbn].reviews); 
    }
});

module.exports.general = public_users;
