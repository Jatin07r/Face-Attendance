const express = require('express');
const db = require('./database');
const router = express.Router();

// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.form;
    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    db.query('SELECT * FROM admins WHERE email = ?', [email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Invalid email' });
        }

        const admin = results[0];

        if (admin.password !== password) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        res.json({ message: 'Login successful', redirect: '/dashboard' });
    });
});

module.exports = router;
