const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const session = require('express-session');

app.use(session({
  secret: 'ThisIsYourUserID',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 hours
}));


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

module.exports = app;