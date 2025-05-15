// judges.js
const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Get assigned events for a judge
router.get('/assigned-events/:judgeID', (req, res) => {
    const { judgeID } = req.params;
    const query = `
        SELECT E.EventID, E.Name, E.Date, E.Time
        FROM Judge_Assignment JA
        JOIN Event E ON JA.EventID = E.EventID
        WHERE JA.JudgeID = ?;
    `;
    db.query(query, [judgeID], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error while fetching events.' });
        res.json(results);
    });
});

// Submit a score
router.post('/submit-score', (req, res) => {
    const { judgeID, participantID, eventID, criteria, scoreValue } = req.body;
    const query = `
        INSERT INTO Score (JudgeID, ParticipantID, EventID, Criteria, ScoreValue)
        VALUES (?, ?, ?, ?, ?);
    `;
    db.query(query, [judgeID, participantID, eventID, criteria, scoreValue], (err) => {
        if (err) return res.status(500).json({ error: 'Error submitting score.' });
        res.json({ message: 'Score submitted successfully.' });
    });
});

// Get participants for a specific event
router.get('/event-participants/:eventID', (req, res) => {
    const { eventID } = req.params;
    const query = `
        SELECT P.ParticipantID, U.Name AS UserName
        FROM Registration R
        JOIN Participant P ON R.ParticipantID = P.ParticipantID
        JOIN User U ON P.UserID = U.UserID
        WHERE R.EventID = ?;
    `;
    db.query(query, [eventID], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching participants.' });
        res.json(results);
    });
});

// Get leaderboard for an event
router.get('/leaderboard/:eventID', (req, res) => {
    const { eventID } = req.params;
    const query = `
        SELECT ParticipantID, AverageScore, Ranke
        FROM Leaderboard
        WHERE EventID = ?
        ORDER BY Ranke ASC;
    `;
    db.query(query, [eventID], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error fetching leaderboard.' });
        res.json(results);
    });
});
//
// Update leaderboard for an event (recalculate average and ranks)
router.post('/update-leaderboard/:eventID', (req, res) => {
    const { eventID } = req.params;

    const avgQuery = `
        SELECT ParticipantID, AVG(ScoreValue) as AverageScore
        FROM Score
        WHERE EventID = ?
        GROUP BY ParticipantID
        ORDER BY AverageScore DESC;
    `;

    const leaderboardInsert = `
        INSERT INTO Leaderboard (EventID, ParticipantID, AverageScore, Ranke)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE AverageScore = VALUES(AverageScore), Ranke = VALUES(Ranke);
    `;

    db.query(avgQuery, [eventID], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error calculating average scores.' });

        const updatePromises = results.map((row, index) => {
            return new Promise((resolve, reject) => {
                db.query(leaderboardInsert, [eventID, row.ParticipantID, row.AverageScore, index + 1], (err2) => {
                    if (err2) return reject(err2);
                    resolve();
                });
            });
        });

        Promise.all(updatePromises)
            .then(() => res.json({ message: 'Leaderboard updated successfully.' }))
            .catch(() => res.status(500).json({ error: 'Error updating leaderboard.' }));
    });
});

// Auto-assign judges to events
router.post('/auto-assign-judges', (req, res) => {
    const getJudges = `SELECT UserID FROM User WHERE Role = 'Judge';`;
    const getEvents = `SELECT EventID FROM Event;`;

    db.query(getJudges, (err, judges) => {
        if (err) return res.status(500).json({ error: 'Error fetching judges.' });

        db.query(getEvents, (err2, events) => {
            if (err2) return res.status(500).json({ error: 'Error fetching events.' });

            const assignments = events.map((event, i) => {
                const judge = judges[i % judges.length];
                return [judge.UserID, event.EventID];
            });

            const insert = `INSERT INTO Judge_Assignment (JudgeID, EventID) VALUES ?`;

            db.query(insert, [assignments], (err3) => {
                if (err3) return res.status(500).json({ error: 'Error assigning judges.' });
                res.json({ message: 'Judges assigned successfully.' });
            });
        });
    });
});

module.exports = router;
