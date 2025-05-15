const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// 1. Venue Schedules & Available Spaces
router.get('/venue-schedule', (req, res) => {
    db.query(`
        SELECT v.Name AS VenueName, e.Name AS EventName, e.Date, e.Time
        FROM Event e
        RIGHT JOIN Venue v ON e.VenueID = v.VenueID
        ORDER BY v.Name, e.Date;
    `, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 2. Total Sponsorship Funds
router.get('/sponsorship-funds', (req, res) => {
    db.query(`
        SELECT SUM(Amount) AS TotalSponsorship FROM Sponsorship;
    `, (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// 3. Room Allocation Report
router.get('/room-allocation', (req, res) => {
    db.query(`
        SELECT ar.RequestID, u.Name AS ParticipantName, a.Name AS Accommodation, 
               ar.NumPeople, ar.Status, ar.RoomAllocated
        FROM Accommodation_Request ar
        JOIN Participant p ON ar.ParticipantID = p.ParticipantID
        JOIN User u ON p.UserID = u.UserID
        LEFT JOIN Accommodation a ON ar.AccommodationID = a.AccommodationID;
    `, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 4. Financial Report
router.get('/financials', (req, res) => {
    db.query(`
        SELECT 
            (SELECT SUM(RegistrationFee) FROM Event e
             JOIN Registration r ON e.EventID = r.EventID) AS TotalRevenue,
            (SELECT SUM(Amount) FROM Sponsorship) AS SponsorFunds,
            (SELECT SUM(BudgetPerPerson * RoomAllocated)
             FROM Accommodation_Request ar
             JOIN Accommodation a ON ar.AccommodationID = a.AccommodationID
             WHERE ar.Status = 'Approved') AS AccommodationCharges;
    `, (err, results) => {
        if (err) throw err;
        res.json(results[0]);
    });
});

// 5. Event Participation Statistics
router.get('/participation-stats', (req, res) => {
    db.query(`
        SELECT e.Name AS EventName, COUNT(r.ParticipantID) AS TotalParticipants
        FROM Registration r
        JOIN Event e ON r.EventID = e.EventID
        GROUP BY r.EventID;
    `, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 6. Venue Utilization Report
router.get('/venue-utilization', (req, res) => {
    db.query(`
        SELECT v.Name AS VenueName, COUNT(e.EventID) AS TotalEvents
        FROM Venue v
        LEFT JOIN Event e ON v.VenueID = e.VenueID
        GROUP BY v.VenueID;
    `, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 7. Participant Demographics (only shows total participants now)
router.get('/participant-demographics', (req, res) => {
    db.query(`
        SELECT Role, COUNT(*) AS Count
        FROM User
        WHERE Role = 'Participant'
        GROUP BY Role;
    `, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 8. Event Duration Report
router.get('/event-duration', (req, res) => {
    db.query(`
        SELECT e.Name AS EventName, e.Date AS EventDate
        FROM Event e
        ORDER BY e.Date DESC;
    `, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 9. Participant Registration Status
router.get('/registration-status', (req, res) => {
    db.query(`
       select *from RegistrationStatusView;
    `, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 10. Sponsorship by Event Report
router.get('/sponsorship-by-event', (req, res) => {
    db.query(`
        SELECT e.Name AS EventName, SUM(s.Amount) AS TotalSponsorship
        FROM Sponsorship s
        JOIN Event e ON s.EventID = e.EventID
        GROUP BY e.EventID;
    `, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 11. Top 5 Most Popular Events by Participants
router.get('/top-events', (req, res) => {
    db.query(`
        SELECT e.Name AS EventName, COUNT(r.ParticipantID) AS TotalParticipants
        FROM Registration r
        JOIN Event e ON r.EventID = e.EventID
        GROUP BY r.EventID
        ORDER BY TotalParticipants DESC
        LIMIT 5;
    `, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 12. Most Requested Accommodation Types
router.get('/accommodation-types', (req, res) => {
    db.query(`
        SELECT a.Name AS AccommodationType, COUNT(ar.RequestID) AS RequestCount
        FROM Accommodation_Request ar
        JOIN Accommodation a ON ar.AccommodationID = a.AccommodationID
        GROUP BY a.AccommodationID
        ORDER BY RequestCount DESC;
    `, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 13. Payment Status by Participant
router.get('/payment-status', (req, res) => {
    db.query(`SELECT * FROM Payment;`, 
        (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 14. Average Sponsorship Per Event
router.get('/avg-sponsorship', (req, res) => {
    db.query(`
        SELECT e.Name AS EventName, AVG(s.Amount) AS AvgSponsorship
        FROM Sponsorship s
        JOIN Event e ON s.EventID = e.EventID
        GROUP BY e.EventID;
    `, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// 15. Top 5 Most Popular Accommodation Requests
router.get('/top-accommodation-requests', (req, res) => {
    db.query(`
        SELECT a.Name AS AccommodationType, COUNT(ar.RequestID) AS RequestCount
        FROM Accommodation_Request ar
        JOIN Accommodation a ON ar.AccommodationID = a.AccommodationID
        GROUP BY a.AccommodationID
        ORDER BY RequestCount DESC
        LIMIT 5;
    `, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

module.exports = router;
