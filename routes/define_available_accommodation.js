
const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

// Define a new available accommodation (for organizers to set available rooms)
router.post('/', (req, res) => {
  const { name, location, totalRooms, roomsAvailable, budgetPerPerson } = req.body;

  // Query to insert available accommodation data
  const sql = `
    INSERT INTO Accommodation (Name, Location, TotalRooms, RoomsAvailable, BudgetPerPerson)
    VALUES (?, ?, ?, ?, ?)
  `;

  connection.query(sql, [name, location, totalRooms, roomsAvailable, budgetPerPerson], (err, result) => {
    if (err) return res.status(500).json({ message: 'Failed to insert accommodation', error: err });

    res.status(200).json({ message: 'Accommodation added successfully' });
  });
});

// Get all available accommodations
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM Accommodation';

  connection.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: 'Failed to retrieve accommodations', error: err });

    res.json(results);
  });
});

module.exports = router;
