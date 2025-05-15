const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connection = require('../db/connection');

const router = express.Router();

// Register route
router.post('/register', (req, res) => {
    const { name, email, password, phone, role } = req.body;

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            return res.status(500).json({ message: 'Error hashing password.' });
        }

        const query = `INSERT INTO User (Name, Email, Password, Phone, Role) VALUES (?, ?, ?, ?, ?)`;
        connection.query(query, [name, email, hashedPassword, phone, role], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error registering user.' });
            }
            res.status(201).json({ message: 'User registered successfully.' });
        });
    });
});

// Login route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = `SELECT * FROM User WHERE Email = ?`;
    connection.query(query, [email], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving user.' });
        }

        if (results.length === 0) {
            return res.status(400).json({ message: 'User not found.' });
        }

        const user = results[0];

        // Compare password with hashed password
        bcrypt.compare(password, user.Password, (err, isMatch) => {
            if (err) {
                return res.status(500).json({ message: 'Error comparing passwords.' });
            }

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials.' });
            }

            // Generate JWT token
            const token = jwt.sign({ userId: user.UserID, role: user.Role }, 'your_jwt_secret_key', {
                expiresIn: '1h',
            });

            res.status(200).json({ message: 'Login successful', token });
        });
    });
});

module.exports = router;
