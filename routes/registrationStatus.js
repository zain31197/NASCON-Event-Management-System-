const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// GET route to fetch registration status view
router.get('/view', (req, res) => {
    const query = `SELECT * FROM RegistrationStatusView`;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching registration status:', err);
            return res.status(500).json({ error: 'Failed to fetch registration status' });
        }

        res.json(results);
    });
});

module.exports = router;
