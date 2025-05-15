const express = require('express');
const path = require('path');
const app = express();

const db = require('./db/connection');

const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');
const sponsorshipRoutes = require('./routes/sponsorship');
const venueRoutes = require('./routes/venue');
const registrationRoutes = require('./routes/registration');
const participantRoutes = require('./routes/participant');
const judgeRoutes = require('./routes/judges');
const sponsorDetailsRoutes = require('./routes/sponsor_detail');
const accommodationRoutes = require('./routes/accommodation');
const defineAccommodationRoutes = require('./routes/define_available_accommodation');
const paymentTrackingRoutes = require('./routes/paymentTracking'); 
const registrationStatusRoutes = require('./routes/registrationStatus');
const reportRoutes = require('./routes/report_dashboard');

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // serve HTML from /public
app.use(express.json()); // parse JSON bodies

// API Routes

app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/sponsorship', sponsorshipRoutes);
app.use('/api/venues', venueRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/participant', participantRoutes);
app.use('/judge', judgeRoutes);
app.use('/sponsor-details', sponsorDetailsRoutes);
app.use('/api/accommodation', accommodationRoutes);
app.use('/api/define-accommodation', defineAccommodationRoutes); // Separate route for defining available accommodations
app.use('/api/payments', paymentTrackingRoutes); // <- route setup
app.use('/api/registration-status', registrationStatusRoutes);
app.use('/api', reportRoutes);
// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on http://localhost:${PORT}`);
});
