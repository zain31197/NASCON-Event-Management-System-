const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// Changed route to just '/' since we'll mount it at /sponsor-details in server.js
router.post('/', (req, res) => {
    const { companyName, contactPerson, email, phone } = req.body;

    console.log('Received data:', req.body);

    if (!companyName || !contactPerson || !email || !phone) {
        return res.status(400).json({ message: 'All sponsor details are required.' });
    }

    const sponsorQuery = `
        INSERT INTO Sponsor (CompanyName, ContactPerson, Email, Phone)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(sponsorQuery, [companyName, contactPerson, email, phone], (err, result) => {
        if (err) {
            console.error('Sponsor insert error:', err);
            return res.status(500).json({ 
                message: 'Database error occurred while saving sponsor details.',
                error: err.message 
            });
        }

        const sponsorId = result.insertId;

        res.status(201).json({
            message: 'Sponsor profile saved successfully.',
            sponsorId,
            redirectTo: '/sponsor_dashboard.html'
        });
    });
});

module.exports = router;