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

// GET route to fetch admin data
router.get('/adminViewData', (req, res) => {
    const query = 'SELECT * FROM admin WHERE email = ?';
    const condition = ['jatin01@facemark.com'];
    db.query(query,condition, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        const copy = results.map(admin => {
            const { password, ...rest } = admin;
            return rest;
        });
        
        res.status(200).json(copy);
    });
});

// GET route to fetch student data
router.get('/studentViewData', (req, res) => {
    const query = 'SELECT * FROM student INNER JOIN attendance ON student.student_id = attendance.student_id INNER JOIN time_table ON student.student_id = time_table.student_id WHERE student.student_id = ?';
    const condition = ['426801'];
    db.query(query,condition, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        const copy = results.map(student => {
            const { password,student_fid, ...rest } = student;
            return rest;
        });
        
        res.status(200).json(copy);
    });
});

module.exports = router;