// sponsorship.js - DARK THEME BACKEND MODULE

const express = require('express');
const router = express.Router();
const db = require('../db/connection');
// Get all available sponsorship packages (static list)
router.get('/packages', (req, res) => {
    const packages = [
        { type: 'Title Sponsor', amount: 50000 },
        { type: 'Gold Sponsor', amount: 30000 },
        { type: 'Silver Sponsor', amount: 15000 },
        { type: 'Media Partner', amount: 10000 }
    ];
    res.json(packages);
});

// Get all sponsors
router.get('/sponsors', (req, res) => {
    db.query('SELECT * FROM Sponsor', (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Add a new sponsorship contract
router.post('/sponsorships', (req, res) => {
    const { eventId, sponsorId, amount, sponsorshipType } = req.body;
    const query = `
        INSERT INTO Sponsorship (EventID, SponsorID, Amount, SponsorshipType)
        VALUES (?, ?, ?, ?)
    `;
    db.query(query, [eventId, sponsorId, amount, sponsorshipType], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Sponsorship contract created', id: result.insertId });
    });
});

// Get all sponsorships with details
router.get('/sponsorships', (req, res) => {
    const query = `
        SELECT s.SponsorshipID, sp.CompanyName, e.Name AS EventName, s.SponsorshipType, s.Amount
        FROM Sponsorship s
        JOIN Sponsor sp ON s.SponsorID = sp.SponsorID
        JOIN Event e ON s.EventID = e.EventID
    `;
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json(results);
    });
});

// Report: Total funds collected
router.get('/sponsorships/total-funds', (req, res) => {
    const query = `SELECT SUM(Amount) AS TotalFunds FROM Sponsorship`;
    db.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json(result[0]);
    });
});

module.exports = router;
