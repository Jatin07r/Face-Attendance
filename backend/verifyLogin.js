const express = require('express');
const mysql = require('mysql2');
const config = require('./dbConfig');
const router = express.Router();

//Database Connection
const db = mysql.createConnection(config);
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

//Admin  Login Route
router.post('/alogin', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT email,password FROM admin WHERE email = ?',[email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email' });
        }

        const admin = results[0];

        if (admin.password!== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }            
        res.json({ message: 'Login successful' });
    });
});

//Student Login Route
router.post('/slogin', (req, res) => {
    const { student_id, password } = req.body;

    db.query('SELECT student_id,password FROM student WHERE student_id = ?',[student_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid student_id' });
        }

        const student = results[0];

        if (student.password!== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }            
        res.json({ message: 'Login successful' });
    });
});

module.exports = router;
