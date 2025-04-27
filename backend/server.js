const express = require('express');
const mysql = require('mysql2');
const config = require('./dbConfig');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://127.0.0.1:5500',
  credentials: true
}));
app.use(express.json());

//Session Store
const db = mysql.createConnection(config);
const sessionStore = new MySQLStore(config, db);
app.use(session({
  key : 'LoginDetails',
  secret: 'ThisIsYourUserID',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 60 * 60 * 1000, secure: false}
}));

app.use(express.static(path.join(__dirname, '../landingpages')));
app.use(express.static(path.join(__dirname, '../adminpages')));
app.use(express.static(path.join(__dirname, '../studentpages')));
app.use(express.static(path.join(__dirname, '../errorpages')));
app.use(express.static(path.join(__dirname, '../models')));

app.get('/facemark', (req, res) => {
  res.sendFile(path.join(__dirname, '../landingpages/homeNavbar.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../adminpages/adminNavbar.html'));
});

app.get('/student', (req, res) => {
  res.sendFile(path.join(__dirname, '../studentpages/studentNavbar.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;