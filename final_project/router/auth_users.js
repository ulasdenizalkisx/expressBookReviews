const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    if (users.filter(u => u.username === username).length > 0) {
        return true;
    }
    else {
        return false;
    }
};

const authenticatedUser = (username,password)=>{
    if (users.filter(u => u.username === username && u.password === password).length > 0) {
        return true;
    }
    else {
        return false;
    }
};


regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    if (!isValid(username)) return res.status(404).send("Username is not valid");
    if (!authenticatedUser(username,req.body.password)) return res.status(404).send("Username or password is not correct");
    if (req.session.authorization) return res.status(404).send("User already logged in");
    let accessToken = jwt.sign({data: req.body.password},"secretToken",{expiresIn: 60 * 60});
    req.session.authorization = {accessToken,username};
    res.status(200).send("User successfully logged in");
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    const review = req.query.review;
    if (!book) return res.status(404).send("No book found");
    if (!review) return res.status(404).send("Review must be written");
    book.reviews[req.session.authorization.username] = review;
    res.status(200).json({
  message: "Review added/updated successfully",
  reviews: book.reviews
});

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const book = books[isbn];
    if (!book) return res.status(404).send("No book found");
    if (book.reviews[req.session.authorization.username]) {
        delete book.reviews[req.session.authorization.username];
        res.status(200).send("Review deleted successfully");
    }
    else {
        res.status(404).send("You dont have any reviews for this book");
    }
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
