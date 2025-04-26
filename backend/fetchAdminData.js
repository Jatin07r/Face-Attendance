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

router.get('/fetchAdminDashboard', async (req, res) => {
    const sessionId = req.session.userId;
    const query = 'SELECT * FROM admin INNER JOIN class_table ON admin.admin_id = class_table.admin_id WHERE admin.admin_id = ?';

    db.query(query, sessionId, (err, adminResults) => {
        if (err) {
            console.error('Error fetching admin data:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (adminResults.length === 0) {
            return res.status(404).json({ error: 'No data found for this user' });
        }

        const userData = adminResults.map(admin => {
            const { password, class_sem, total_students, ...rest } = admin;
            return rest;
        });

        const classData = adminResults.map(admin => {
            const { class_sem, total_students } = admin;
            return { class_sem, total_students };
        });
        
        db.query(`SELECT 
                    'classwise' AS type,
                    CONCAT(student.class, '(', student.semester, ')') AS class_sem, 
                    COUNT(*) AS total_attendance,
                    FORMAT(COUNT(CASE WHEN attendance.status = 'Present' THEN 1 END) * 100.0 / COUNT(*), 2) AS present_percentage,
                    FORMAT(COUNT(CASE WHEN attendance.status = 'Absent' THEN 1 END) * 100.0 / COUNT(*), 2) AS absent_percentage,
                    COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present_count,
                    COUNT(CASE WHEN status = 'Absent' THEN 1 END) AS absent_count
                FROM attendance
                JOIN student ON attendance.student_id = student.student_id
                GROUP BY student.class, student.semester
                
                UNION ALL
                
                SELECT 
                    'combined_summary' AS type,
                    NULL AS class_sem, 
                    COUNT(*) AS total_attendance,
                    FORMAT(COUNT(CASE WHEN status = 'Present' THEN 1 END) * 100.0 / COUNT(*), 2) AS present_percentage,
                    FORMAT(COUNT(CASE WHEN status = 'Absent' THEN 1 END) * 100.0 / COUNT(*), 2) AS absent_percentage,
                    COUNT(CASE WHEN status = 'Present' THEN 1 END) AS present_count,
                    COUNT(CASE WHEN status = 'Absent' THEN 1 END) AS absent_count
                FROM attendance
                JOIN student ON attendance.student_id = student.student_id
                `,(err, chartResults) => {
                if (err) {
                    console.error("Error fetching admin data:", err);
                    return res.status(500).json({ error: "Database query failed" });
                }
                const classwise = chartResults.filter(row => row.type === 'classwise');
                const combined_summary = chartResults.find(row => row.type === 'combined_summary');

                const chartData = { classwise, combined_summary };

                res.status(200).json({ userData, classData, chartData });
            }
        );
    });
});

module.exports = router;
