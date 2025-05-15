const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const path = require('path'); // Add the 'path' module to handle paths

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'zain3119',
  database: 'project_iteration2'
});

// Serve "View Events" page
router.get('/view-events', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/participant_view_events.html'));
});

// Serve "Register for Event" page
router.get('/register-event', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/participant_register_event.html'));
});

// Serve "My Registrations" page
router.get('/my-registrations', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/participant_my_registrations.html'));
});

// API: GET all events (for fetching events)
router.get('/events', (req, res) => {
    const query = 'SELECT * FROM Event';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching events:', err);
            return res.status(500).send('Error fetching events');
        }
        res.json(results);
    });
});

// API: POST register for an event
router.post('/register', (req, res) => {
    const { userID, individualOrTeam, eventID } = req.body;

    if (!userID || !individualOrTeam || !eventID) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Step 1: Check if participant already exists
    const checkQuery = 'SELECT ParticipantID FROM Participant WHERE UserID = ?';
    db.query(checkQuery, [userID], (err, results) => {
        if (err) {
            console.error('Error checking participant:', err);
            return res.status(500).send('Server error');
        }

        if (results.length > 0) {
            const participantID = results[0].ParticipantID;
            registerEvent(participantID);
        } else {
            const insertParticipant = 'INSERT INTO Participant (UserID, IndividualOrTeam) VALUES (?, ?)';
            db.query(insertParticipant, [userID, individualOrTeam], (err, result) => {
                if (err) {
                    console.error('Error inserting participant:', err);
                    return res.status(500).send('Server error');
                }
                const participantID = result.insertId;
                registerEvent(participantID);
            });
        }
    });

    // Step 2: Register into Registration table
    function registerEvent(participantID) {
        const registrationQuery = 'INSERT INTO Registration (ParticipantID, EventID, RegistrationDate) VALUES (?, ?, CURDATE())';
        db.query(registrationQuery, [participantID, eventID], (err, result) => {
            if (err) {
                console.error('Error registering for event:', err);
                return res.status(500).send('Server error');
            }
            res.status(201).json({ message: 'Successfully registered for event!' });
        });
    }
});

// API: GET my registrations
router.get('/my-registrations/:userID', (req, res) => {
    const userID = req.params.userID;

    const query = `
        SELECT e.Name, e.Date, e.Time, e.Category
        FROM Registration r
        JOIN Participant p ON r.ParticipantID = p.ParticipantID
        JOIN Event e ON r.EventID = e.EventID
        WHERE p.UserID = ?
    `;
    db.query(query, [userID], (err, results) => {
        if (err) {
            console.error('Error fetching registrations:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});

// API: POST register team
router.post('/register-team', async (req, res) => {
    const { eventID, teamName, participantID } = req.body;

    try {
        // Insert team into the database
        const [teamResult] = await db.promise().execute(
            'INSERT INTO Team (EventID, TeamName, CaptainParticipantID) VALUES (?, ?, ?)',
            [eventID, teamName, participantID]
        );

        const teamID = teamResult.insertId;

        // Insert captain into Team_Participant table
        await db.promise().execute(
            'INSERT INTO Team_Participant (TeamID, ParticipantID) VALUES (?, ?)',
            [teamID, participantID]
        );

        res.json({ message: 'Team registered successfully', teamID });
    } catch (error) {
        console.error('Error registering team:', error);
        res.status(500).json({ message: 'Error registering team' });
    }
});


module.exports = router;
