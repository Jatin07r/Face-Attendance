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
        res.json({success:true, message: 'verification successful'});
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
        res.json({success:true, message: 'verification successful' });
    });
});

//Student Face ID Login Route
function euclideanDistance(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        throw new Error('Descriptor arrays must have the same length');
    }
    return Math.sqrt(arr1.reduce((sum, val, i) => sum + Math.pow(val - arr2[i], 2), 0));
  }

router.post('/sflogin', (req, res) => {
    const { student_face } = req.body;

    if (!student_face || !Array.isArray(student_face)) {
        return res.status(400).json({ success: false, error: 'Invalid face descriptor' });
    }

    db.query('SELECT student_id, student_face FROM student', (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, error: 'Database error' });
        }

        let bestMatch = { id: null, distance: Infinity };
        let parseError = false;
        let noFaceFound = true;

        try {
            results.forEach(row => {
                let storedDescriptor;
                  if (!row.student_face) {
                    console.error('Invalid or missing student_face data for student_id:', row.student_id);
                    return; 
                }

                try {
                    const parsedData = row.student_face;
                    storedDescriptor = parsedData.descriptor;
                } catch (error) {
                    console.error('Error parsing face descriptor from database for student_id:', row.student_id, error);
                    parseError = true;
                    return;
                }

                if (student_face.length !== storedDescriptor.length) {
                    console.error('Descriptor length mismatch for student_id:', row.student_id);
                    return;
                }

                const distance = euclideanDistance(student_face, storedDescriptor);

                if (distance < bestMatch.distance) {
                    bestMatch = { id: row.student_id, distance };
                    noFaceFound = false; 
                }
            });

            if (parseError) {
                return res.json({ success: false, error: 'Parsing error' });
            }

            if (noFaceFound) {
                return res.json({ success: false, error: 'No matching face found' });
            }

            if (bestMatch.distance < 0.5) {
                return res.json({ success: true, message: 'Verification successful', student_id: bestMatch.id });
            } else {
                return res.json({ success: false, error: 'No matching face found' });
            }
        } catch (error) {
            console.error('Error during face matching:', error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    });
});

module.exports = router;
