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

router.post('/add', (req, res) => {
    const { student_id, subject_name, date_time, status } = req.body;

    db.query('INSERT INTO attendance (student_id, subject_name, date_time, status) VALUES (?, ?, ?, ?)',[student_id, subject_name, date_time, status], (err, results) => {
        if (err) {
            return res.status(500).json({success:false, error: 'Database error' });
        }

        res.json({success:true, message: 'added successful' });
    });
});

module.exports = router;
