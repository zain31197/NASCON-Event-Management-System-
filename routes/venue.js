// routes/venue.js
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

// Fetch all venues
router.get('/', (req, res) => {
  db.query('SELECT * FROM Venue', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Add new venue
router.post('/', (req, res) => {
  const { name, location, capacity } = req.body;
  db.query('INSERT INTO Venue (Name, Location, Capacity) VALUES (?, ?, ?)', 
    [name, location, capacity],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Venue added successfully', venueId: result.insertId });
    });
});

// Update venue
router.put('/:id', (req, res) => {
  const { name, location, capacity } = req.body;
  db.query('UPDATE Venue SET Name=?, Location=?, Capacity=? WHERE VenueID=?',
    [name, location, capacity, req.params.id],
    (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Venue updated successfully' });
    });
});

// Delete venue
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Venue WHERE VenueID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: 'Venue deleted successfully' });
  });
});

module.exports = router;
