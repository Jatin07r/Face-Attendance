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
    console.log('Download database');
});

// GET route to download attendance
router.get('/downloadAttendance', (req, res) => {
    const query = `SELECT 
                    attendance.student_id, 
                    student.name AS student_name,
                    CONCAT(student.class, '(', student.semester,')') AS class_sem,
                    attendance.subject_name, 
                    attendance.status,
                    DATE_FORMAT(attendance.date_time, '%Y-%m-%d %h:%i %p') AS date
                FROM attendance 
                JOIN student ON attendance.student_id = student.student_id 
                ORDER BY attendance.date_time DESC
                `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        const downloadAttendance = results.map(admin => {
            const { password, student_fid, ...rest } = admin;
            return rest;
        });
        
        res.status(200).json(downloadAttendance);
    });
});

module.exports = router;