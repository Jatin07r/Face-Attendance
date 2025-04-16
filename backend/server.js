const express = require('express');
const mysql = require('mysql2');
const config = require('./dbConfig');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const cors = require('cors');

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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;