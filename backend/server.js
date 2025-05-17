const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const db = require('./db');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 2000;

app.use(cors());
app.use(express.json());

//Session Store
const sessionStore = new MySQLStore({}, db);
app.set('trust proxy', 1);
app.use(session({
  key : 'connect.sid',
  secret: process.env.SESSION_SECRET || 'ThisIsYourSessionID',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: 2 * 60 * 60 * 1000, secure: false, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
}));

app.use(express.static(path.join(__dirname, '../landingpages')));
app.use(express.static(path.join(__dirname, '../adminpages')));
app.use(express.static(path.join(__dirname, '../studentpages')));
app.use(express.static(path.join(__dirname, '../errorpages')));
app.use(express.static(path.join(__dirname, '../models')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../landingpages/homeNavbar.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;