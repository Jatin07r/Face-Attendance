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
router.get('/fetchAdminAttendance', (req, res) => {
    const query = 'SELECT * FROM student INNER JOIN attendance ON student.student_id = attendance.student_id INNER JOIN time_table ON student.student_id = time_table.student_id';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        const attedanceData = results.map(admin => {
            const { password, student_fid, ...rest } = admin;
            return rest;
        });
        
        res.status(200).json(attedanceData);
    });
});

// GET route to fetch student data
router.get('/fetchStudentAttendance', (req, res) => {
    const query = 'SELECT * FROM student INNER JOIN attendance ON student.student_id = attendance.student_id INNER JOIN time_table ON student.student_id = time_table.student_id WHERE student.student_id = ?';
    const condition = ['426801'];
    db.query(query,condition, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        const attedanceData = results.map(student => {
            const { password,student_fid, ...rest } = student;
            return rest;
        });
        
        res.status(200).json(attedanceData);
    });
});

module.exports = router;