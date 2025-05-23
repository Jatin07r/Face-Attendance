const express = require('express');
const router = express.Router();
const db = require('./db');

// GET route to fetch admin data
router.get('/fetchAdminView', (req, res) => {
    const query = `SELECT 
                    attendance.student_id, 
                    student.name AS student_name,
                    CONCAT(student.class, '(', student.semester,')') AS class_sem,
                    attendance.subject_name, 
                    attendance.status,
                    DATE_FORMAT(attendance.date_time, '%Y-%m-%d %h:%i %p') AS date
                FROM attendance 
                JOIN student ON attendance.date_time >= NOW() - INTERVAL 1 MONTH AND attendance.student_id = student.student_id 
                ORDER BY attendance.date_time DESC
                `;
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        const adminAttendanceData = results.map(admin => {
            const { password, student_face, ...rest } = admin;
            return rest;
        });
        
        res.status(200).json(adminAttendanceData);
    });
});

// GET route to fetch student data
router.get('/fetchStudentView', (req, res) => {
   const query = `SELECT 
                    attendance.student_id,
                    CONCAT(student.class, '(', student.semester,')') AS class_sem,
                    attendance.subject_name, 
                    attendance.status,
                    DATE_FORMAT(attendance.date_time, '%Y-%m-%d %h:%i %p') AS date
                FROM attendance 
                JOIN student ON attendance.date_time >= NOW() - INTERVAL 1 MONTH AND attendance.student_id = student.student_id 
                WHERE attendance.student_id = ?
                ORDER BY attendance.date_time DESC
                `;
    const sessionId = req.session.userId;
    db.query(query, sessionId, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        const studentAttendanceData1 = results.map(student => {
            const { password,student_face, ...rest } = student;
            return rest;
        });
        
        res.status(200).json(studentAttendanceData1);
    });
});

module.exports = router;