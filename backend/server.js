const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const reservationsFilePath = path.join(__dirname, 'details.json');

const readReservations = () => {
  try {
    const data = fs.readFileSync(reservationsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reservations file:', error);
    return [];
  }
};

const writeReservations = (reservations) => {
  try {
    fs.writeFileSync(reservationsFilePath, JSON.stringify(reservations, null, 2));
  } catch (error) {
    console.error('Error writing reservations file:', error);
  }
};

const reservationExists = (newReservation) => {
  const reservations = readReservations();
  return reservations.some(
    (reservation) =>
      reservation.name === newReservation.name &&
      reservation.email === newReservation.email &&
      reservation.phone === newReservation.phone &&
      reservation.date === newReservation.date &&
      reservation.time === newReservation.time
  );
};

// POST endpoint to handle new reservations
app.post('/api/reservations', (req, res) => {
  const newReservation = req.body;

  if (reservationExists(newReservation)) {
    return res.status(400).json({ success: false, message: 'Reservation already exists!' });
  }

  const reservations = readReservations();
  reservations.push(newReservation);
  writeReservations(reservations);

  res.json({ success: true, message: 'Reservation added successfully!' });
});

// GET endpoint to retrieve all reservations
app.get('/api/reservations', (req, res) => {
  const reservations = readReservations();
  res.json(reservations);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
