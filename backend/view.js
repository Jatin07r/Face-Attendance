const express = require('express');
const db = require('./database');

router.post('/veiw', (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM admin where email =?',[email], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
    });
});