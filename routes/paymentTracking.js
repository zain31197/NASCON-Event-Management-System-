const express = require('express');
const router = express.Router();
const db = require('../db/connection'); // Ensure this path is correct

router.post('/pay', (req, res) => {
    const { participantId, eventId, amount, method } = req.body;

    // Basic validation
    if (!participantId || !eventId || !amount || !method) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    console.log('Received payment data:', { participantId, eventId, amount, method });

    const query = `
        INSERT INTO Payment (ParticipantID, EventID, Amount, PaymentMethod)
        VALUES (?, ?, ?, ?)
    `;

    db.execute(query, [participantId, eventId, amount, method], (err, result) => {
        if (err) {
            console.error('Error executing payment insert:', err.message);
            return res.status(500).json({ error: 'Payment failed. Please try again.' });
        }

        console.log('Payment inserted successfully, PaymentID:', result.insertId);
        res.json({ message: 'Payment successful', PaymentID: result.insertId });
    });
});

module.exports = router;
