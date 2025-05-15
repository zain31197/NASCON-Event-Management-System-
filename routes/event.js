// routes/event.js
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

// GET all events
router.get('/', (req, res) => {
    db.query('SELECT * FROM Event', (err, results) => {
        if (err) {
            console.error('Error fetching events:', err.stack);
            return res.status(500).send('Error fetching events');
        }
        res.json(results);
    });
});

// POST create a new event
router.post('/', (req, res) => {
    const { name, category, description, rules, maxParticipants, registrationFee, date, time, venueID, organizerID } = req.body;

    const query = `
        INSERT INTO Event (Name, Category, Description, Rules, MaxParticipants, RegistrationFee, Date, Time, VenueID, OrganizerID)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(query, [name, category, description, rules, maxParticipants, registrationFee, date, time, venueID, organizerID], (err, result) => {
        if (err) {
            console.error('Error adding event:', err.stack);
            return res.status(500).send('Error adding event');
        }
        res.status(201).json({ message: 'Event created successfully', eventID: result.insertId });
    });
});

// PUT update an event
router.put('/:id', (req, res) => {
    const eventID = req.params.id;
    const { name, category, description, rules, maxParticipants, registrationFee, date, time, venueID, organizerID } = req.body;

    const query = `
        UPDATE Event
        SET Name = ?, Category = ?, Description = ?, Rules = ?, MaxParticipants = ?, RegistrationFee = ?, Date = ?, Time = ?, VenueID = ?, OrganizerID = ?
        WHERE EventID = ?
    `;
    db.query(query, [name, category, description, rules, maxParticipants, registrationFee, date, time, venueID, organizerID, eventID], (err, result) => {
        if (err) {
            console.error('Error updating event:', err.stack);
            return res.status(500).send('Error updating event');
        }
        res.json({ message: 'Event updated successfully' });
    });
});

// DELETE an event
router.delete('/:id', (req, res) => {
    const eventID = req.params.id;

    db.query('DELETE FROM Event WHERE EventID = ?', [eventID], (err, result) => {
        if (err) {
            console.error('Error deleting event:', err.stack);
            return res.status(500).send('Error deleting event');
        }
        res.json({ message: 'Event deleted successfully' });
    });
});

module.exports = router;
