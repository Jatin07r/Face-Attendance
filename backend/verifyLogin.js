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

    db.query('SELECT admin_id,email,password FROM admin WHERE email = ?',[email], (err, results) => {
        if (err) {
            return res.status(500).json({success:false, error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({success:false, error: 'Invalid email' });
        }

        const admin = results[0];
        if (admin.password!== password) {
            return res.status(401).json({success:false, error: 'Invalid password' });
        }
        
        // req.session.userId = admin.admin_id;
        res.json({success:true, message: 'Login successful'});
    });
});

//Student ID Login Route
router.post('/sidlogin', (req, res) => {
    const { student_id, password } = req.body;

    db.query('SELECT student_id,password FROM student WHERE student_id = ?',[student_id], (err, results) => {
        if (err) {
            return res.status(500).json({success:false, error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({success:false, error: 'Invalid student id' });
        }

        const student = results[0];

        if (student.password!== password) {
            return res.status(401).json({success:false, error: 'Invalid password' });
        }            
        // req.session.userId = student_id;
        res.json({success:true, message: 'Login successful' });
    });
});

//Student Face ID Login Route
router.post('/sflogin', (req, res) => {
    const { student_fid } = req.body;

    db.query('SELECT student_fid FROM student WHERE student_fid = ?',[student_fid], (err, results) => {
        if (err) {
            return res.status(500).json({success:false, error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({success:false, error: 'Match Not Found' });
        }

        // req.session.userId = student_id;
        res.json({success:true, message: 'Login successful' });
    });
});

module.exports = router;
