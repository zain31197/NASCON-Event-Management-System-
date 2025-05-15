const express = require('express');
const router = express.Router();
const connection = require('../db/connection'); //  direct import

// POST: Submit accommodation request
router.post('/request', (req, res) => {
  const { participantID, numPeople, maxBudget } = req.body;

  const insertSql = `
    INSERT INTO Accommodation_Request (ParticipantID, NumPeople, MaxBudget)
    VALUES (?, ?, ?)
  `;

  connection.query(insertSql, [participantID, numPeople, maxBudget], (err, result) => {
    if (err) return res.status(500).json({ error: err });

    const requestId = result.insertId;

    // Call stored procedure to assign accommodation
    connection.query('CALL AssignAccommodation(?)', [requestId], (err2) => {
      if (err2) return res.status(500).json({ error: err2 });

      res.status(200).json({ message: 'Accommodation request submitted and processed', requestId });
    });
  });
});

// GET: Room allocations
router.get('/allocations', (req, res) => {
  const sql = `
    SELECT ar.RequestID, u.Name AS ParticipantName, ar.NumPeople, ar.MaxBudget,
           a.Name AS AccommodationName, a.Location, ar.RoomAllocated, ar.Status, ar.RequestDate
    FROM Accommodation_Request ar
    JOIN Participant p ON ar.ParticipantID = p.ParticipantID
    JOIN User u ON p.UserID = u.UserID
    LEFT JOIN Accommodation a ON ar.AccommodationID = a.AccommodationID
    ORDER BY ar.RequestDate DESC
  `;

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

module.exports = router;
