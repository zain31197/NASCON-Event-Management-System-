// routes/user.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'zain3119',
    database: 'project_iteration2'
});

// POST route for creating a new user 
router.post('/', (req, res) => {
    const { name, email, phone, role, password } = req.body;

    if (!name || !email || !role || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = 'INSERT INTO User (Name, Email, Phone, Role, Password) VALUES (?, ?, ?, ?, ?)';
    db.execute(query, [name, email, phone, role, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error registering user', details: err });
        }
        return res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    });
});

// Route for login 
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = 'SELECT * FROM User WHERE Name = ? AND Password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) {
            console.error('Error during login:', err);
            return res.status(500).json({ success: false, message: 'Server error' });
        }

        if (results.length > 0) {
            const user = results[0];
            res.json({
                success: true,
                user: {
                    id: user.UserID,
                    name: user.Name,
                    role: user.Role
                }
            });
        } else {
            res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});

module.exports = router;
