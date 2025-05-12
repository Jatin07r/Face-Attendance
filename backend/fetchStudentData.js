const express = require('express');
const router = express.Router();
const db = require('./db');

router.get('/fetchStudentDashboard', (req, res) => {
    const sessionId= req.session.userId;
    const query = `SELECT  student.*, time_table.*,
    DATE_FORMAT(time_table.subject_time, '%h:%i %p') as date_time 
    FROM student
    INNER JOIN time_table ON time_table.student_id = student.student_id
    WHERE student.student_id = ?`;
    db.query(query, sessionId, (err, studentResults) => {
        if (err) {
            console.error('Error fetching student data:', err);
            return res.status(500).json({ error: 'Database query failed' });
        }
        if (studentResults.length === 0) {
            return res.status(404).json({ error: 'No data found for this user' });
        }

        const userData = studentResults.map(admin => {
            const { student_face, password, ...rest } = admin;
            return rest;
        });

        const subjectData = studentResults.map(admin => {
            const { subject_name, subject_class, date_time } = admin;
            return { subject_name, subject_class, date_time };
        });

        const query = `SELECT 
                        'subjectwise' AS type,
                        subject_name,
                        COUNT(*) AS total_attendance,
                        FORMAT(COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / COUNT(*), 2) AS present_percentage,
                        FORMAT(COUNT(CASE WHEN status = 'absent' THEN 1 END) * 100.0 / COUNT(*), 2) AS absent_percentage,
                        NULL AS present_count,
                        NULL AS absent_count
                    FROM attendance
                    WHERE student_id = ?
                    GROUP BY subject_name
                    
                    UNION ALL
                    
                    SELECT 
                        'combined_summary' AS type,
                        NULL AS subject_name,
                        COUNT(*) AS total_attendance,
                        FORMAT(COUNT(CASE WHEN status = 'present' THEN 1 END) * 100.0 / COUNT(*), 2) AS present_percentage,
                        FORMAT(COUNT(CASE WHEN status = 'absent' THEN 1 END) * 100.0 / COUNT(*), 2) AS absent_percentage,
                        COUNT(CASE WHEN status = 'present' THEN 1 END) AS present_count,
                        COUNT(CASE WHEN status = 'absent' THEN 1 END) AS absent_count
                    FROM attendance
                    WHERE student_id = ?;
            `;
        db.query(query, [sessionId,sessionId], (err, chartResults) => {
            if (err) {
                console.error("Error fetching student data:", err);
                return res.status(500).json({ error: "Database query failed" });
            }
            const subjectwise = chartResults.filter(row => row.type === 'subjectwise');
            const combined_summary = chartResults.find(row => row.type === 'combined_summary');
            const chartData = { subjectwise, combined_summary };

            res.status(200).json({ userData, subjectData, chartData});
        });
    });
});

module.exports = router;
