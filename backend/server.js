const express = require('express');
const db = require('./database');
const cors = require('cors');
const loginRoute = require('./verifyLogin');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Login check
app.use('/', loginRoute);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/facemark`);
});
