const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/add', (req, res) => {
    const { student_id, subject_name, date_time, status } = req.body;

    db.query('SELECT * FROM time_table WHERE student_id',[student_id], (err, results) => {
        if (err) {
            return res.status(500).json({success:false, error: 'Database error' });
        } 
        const validSubject = results.find(row => row.subject_name.trim().toLowerCase() === subject_name);
        if (!validSubject) {
            return res.status(400).json({ success: false, error: 'Incorrect subject name' });
        }
        db.query('INSERT INTO attendance (student_id, subject_name, date_time, status) VALUES (?, ?, ?, ?)',[student_id, subject_name, date_time, status], (err, results) => {
            if (err) {
                return res.status(500).json({success:false, error: 'Database error' });
            }
            
            res.json({success:true, message: 'added successful' });
        });
    });
});

module.exports = router;
