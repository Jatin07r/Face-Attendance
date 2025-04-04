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

// // GET route to fetch student data
router.get('/studentViewData', (req, res) => {
    const query = 'SELECT * FROM student INNER JOIN attendance ON student.student_id = attendance.student_id INNER JOIN time_table ON student.student_id = time_table.student_id WHERE student.student_id = ?';
    const condition = ['426801'];
    db.query(query,condition, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        const copy = results.map(student => {
            const { password, ...rest } = student;
            return rest;
        });
        
        res.status(200).json(copy);
    });
});

// GET route to fetch admin data
router.get('/adminViewData', (req, res) => {
    const query = 'SELECT * FROM admin INNER JOIN class_table ON admin.admin_id = class_table.admin_id WHERE admin.admin_id = ?';
    const condition = ['1'];
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

module.exports = router;