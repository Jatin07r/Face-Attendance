const express = require('express');
const mysql = require('mysql2');
const config = require('./dbConfig');
const router = express.Router();
// import getCookie from './cookieHandler';


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
    const userId = req.session.userId;
    const query = 'SELECT * FROM admin INNER JOIN class_table ON admin.admin_id = class_table.admin_id WHERE admin.admin_id = ?';
    const condition = [userId];
        db.query(query, condition, (err, results) => {
        if (err) {
            console.error('Error fetching admin data:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        const copy = results.map(admin => {
            const { password,class_sem, total_students, ...rest } = admin;
            return rest;
    });
    const copy2 = results.map(admin => {
        const { class_sem, total_students, ...rest } = admin;
        return({ class_sem, total_students}) ;
});
        
        res.status(200).json({copy,copy2});
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
            const { password,student_fid, ...rest } = student;
            return rest;
        });
        
        res.status(200).json(copy);
    });
});

module.exports = router;
