const express = require('express');
const axios = require('axios');
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
public_users.get('/', async (req, res) => {
    res.json(books);
});

//Get the book list asynchronously in the shop
public_users.get('/book', async (req, res) => {
    const response = await axios.get("http://localhost:5000/");
    res.json(response.data);
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

//Get book details asynchronously based on ISBN
 public_users.get('/isbna/:isbn',async function (req, res) {
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${req.params.isbn}`);
        res.send(response.data);
    }
    catch (err) {
        res.send(err);
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

//Get book details based on author asynchronously
public_users.get('/authora/:author',async (req, res) =>{
    try {
        const response = await axios.get(`http://localhost:5000/author/${req.params.author}`);
        res.send(response.data);
    }
    catch (err) {
        res.send(err);
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

//Get all book based on title asynchoronusly
public_users.get('/titlea/:title',async (req, res) => {
    try {
        const response = await axios.get(`http://localhost:5000/title/${req.params.title}`);
        res.send(response.data);
    }
    catch (err) {
        res.send(err);
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
