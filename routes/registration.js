// routes/registration.js
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

// Fetch all registrations with participant and event details
router.get('/', (req, res) => {
  const query = `
    SELECT r.RegistrationID, u.Name AS ParticipantName, e.Name AS EventName, r.RegistrationDate
    FROM Registration r
    JOIN Participant p ON r.ParticipantID = p.ParticipantID
    JOIN User u ON p.UserID = u.UserID
    JOIN Event e ON r.EventID = e.EventID
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = router;
