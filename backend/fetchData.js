const express = require('express');
const mysql = require('mysql2');
const router = express.Router();
const config = require('./dbConfig');

//Database Connection
const db = mysql.createConnection(config);
db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database');
});

// GET route to fetch admin data
router.get('/adminFetchData', (req, res) => {
    const query = 'SELECT * FROM admin WHERE email = ?';
    const condition = ['jatin01@facemark.com'];
    db.query(query, condition, (err, results) => {
        if (err) {
            console.error('Error fetching admin data:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        const copy = results.map(admin => {
            const { password, ...rest } = admin;
            return rest;
        });
        
        res.status(200).json(copy);
    });
});

// GET route to fetch student data
router.get('/studentFetchData', (req, res) => {
    const query = 'SELECT * FROM student WHERE student_id = ?';
    const condition = ['426801'];
    db.query(query, condition, (err, results) => {
        if (err) {
            console.error('Error fetching student data:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        const copy = results.map(student => {
            const { password, ...rest } = student;
            return rest;
        });
        
        res.status(200).json(copy);
    });
});

module.exports = router;
