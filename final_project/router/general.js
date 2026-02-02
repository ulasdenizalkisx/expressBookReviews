const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/**
 * Register a new user
 */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).send("Username and password must be provided");
  }

  const exists = users.some(u => u.username === username);
  if (exists) {
    return res.status(409).send(`Username ${username} already exists`);
  }

  users.push({ username, password });
  return res.status(201).send(`New user ${username} has been created`);
});

/**
 * Get the full book list (sync in-memory)
 */
public_users.get('/', async (req, res) => {
  return res.json(books);
});

/**
 * Get the full book list asynchronously (Axios)
 * Uses dynamic host to avoid localhost issues in cloud IDEs.
 */
public_users.get('/book', async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const response = await axios.get(`${baseUrl}/`);
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching books asynchronously",
      error: err.message
    });
  }
});

/**
 * Get book details based on ISBN
 */
public_users.get('/isbn/:isbn', (req, res) => {
  const { isbn } = req.params;

  if (!isbn || !books[isbn]) {
    return res.status(404).send("There is an error with your request");
  }

  return res.status(200).json(books[isbn]);
});

/**
 * Get book details asynchronously based on ISBN (Axios)
 */
public_users.get('/isbna/:isbn', async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const response = await axios.get(`${baseUrl}/isbn/${req.params.isbn}`);
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching book by ISBN asynchronously",
      error: err.message
    });
  }
});

/**
 * Get book details based on author (sync in-memory filter)
 */
public_users.get('/author/:author', (req, res) => {
  const { author } = req.params;

  if (!author) {
    return res.status(400).send("No author name");
  }

  const booksArray = Object.values(books);
  const found = booksArray.filter(b => b.author === author);

  if (found.length === 0) {
    return res.status(404).send("No book found for this author");
  }

  return res.status(200).json(found);
});

/**
 * Get book details based on author asynchronously (Axios)
 */
public_users.get('/authora/:author', async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const response = await axios.get(`${baseUrl}/author/${req.params.author}`);
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching books by author asynchronously",
      error: err.message
    });
  }
});

/**
 * Get all books based on title (sync in-memory filter)
 */
public_users.get('/title/:title', (req, res) => {
  const { title } = req.params;

  if (!title) {
    return res.status(400).send("Title must be provided");
  }

  const booksArray = Object.values(books);
  const found = booksArray.filter(b => b.title === title);

  if (found.length === 0) {
    return res.status(404).send("No book has been found");
  }

  return res.status(200).json(found);
});

/**
 * Get all books based on title asynchronously (Axios)
 */
public_users.get('/titlea/:title', async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const response = await axios.get(`${baseUrl}/title/${req.params.title}`);
    return res.json(response.data);
  } catch (err) {
    return res.status(500).json({
      message: "Error fetching books by title asynchronously",
      error: err.message
    });
  }
});

/**
 * Get book reviews by ISBN
 */
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;

  const book = books[isbn];
  if (!book) {
    return res.status(404).send("No book found");
  }

  return res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;
