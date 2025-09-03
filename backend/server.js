const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ride_sharing_app';
mongoose.connect(MONGODB_URI).then(() => console.log('MongoDB connected...')).catch(err => console.error(err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  notificationPreferences: { type: Boolean, default: false },
  theme: { type: String, default: 'light' },
  otherSetting: { type: String, default: '' },
  bookedRides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],
  offeredRides: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }],
});

const User = mongoose.model('User', userSchema);

// Ride Schema and Model
const rideSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User who offered the ride
  driver: { // Embedded driver details (denormalized)
    name: { type: String },
    rating: { type: Number, default: 0 },
    trustScore: { type: String, default: 'medium' },
    avatar: { type: String, default: '' },
    trips: { type: Number, default: 0 },
    memberSince: { type: String, default: '' },
    verified: { type: Boolean, default: false },
    bio: { type: String, default: '' },
  },
  from: { type: String, required: true },
  to: { type: String, required: true },
  date: { type: String, required: true },
  departure: { type: String, required: true },
  price: { type: Number, required: true },
  seats: { type: Number, required: true },
  passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  duration: { type: String },
  distance: { type: String },
  route: { type: Array }, // Array of [lat, lng] pairs
  routeDetails: {
    stops: { type: Array },
    description: { type: String }
  },
  car: {
    model: { type: String },
    year: { type: Number },
    color: { type: String },
    features: { type: Array }
  },
  description: { type: String },
  rules: { type: Array },
}, { timestamps: true });

const Ride = mongoose.model('Ride', rideSchema);

// User Routes
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password })
      .populate({ path: 'bookedRides', select: 'from to date departure' })
      .populate({ path: 'offeredRides', select: 'from to date departure' }); // In a real app, hash passwords!
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const { id } = req.params;
    const { name, email, password, notificationPreferences, theme, otherSetting, bookedRides, offeredRides } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, password, notificationPreferences, theme, otherSetting, bookedRides, offeredRides },
      { new: true }
    ).populate('bookedRides').populate('offeredRides');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    const { id } = req.params;
    const user = await User.findById(id)
      .populate({ path: 'bookedRides', select: 'from to date departure' })
      .populate({ path: 'offeredRides', select: 'from to date departure' });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/:id/book-ride', async (req, res) => {
  try {
    const { id } = req.params;
    const { rideId } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(rideId)) {
      return res.status(400).json({ message: 'Invalid user or ride ID format' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    if (ride.seats <= 0) {
      return res.status(400).json({ message: 'No seats available for this ride' });
    }

    if (ride.passengers.includes(id)) {
      return res.status(400).json({ message: 'User already booked this ride' });
    }

    if (ride.userId.toString() === id) {
      return res.status(400).json({ message: 'You cannot book your own ride' });
    }

    // Decrement seats and add passenger
    ride.seats -= 1;
    ride.passengers.push(id);
    await ride.save();

    // Add ride to user's bookedRides using $addToSet to prevent duplicates
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $addToSet: { bookedRides: rideId } }, // Use $addToSet
      { new: true } // Return the updated document
    ).populate('bookedRides').populate('offeredRides');

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found after update' });
    }

    res.status(200).json({ message: 'Ride booked successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id/cancel-ride/:rideId', async (req, res) => {
  try {
    const { id, rideId } = req.params;
    console.log(`Attempting to cancel ride. User ID: ${id}, Ride ID: ${rideId}`);

    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(rideId)) {
      console.log('Invalid ID format in cancel-ride');
      return res.status(400).json({ message: 'Invalid user or ride ID format' });
    }

    const user = await User.findById(id);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'User not found' });
    }
    console.log('User found:', user.email);

    const ride = await Ride.findById(rideId);
    if (!ride) {
      console.log('Ride not found');
      return res.status(404).json({ message: 'Ride not found' });
    }
    console.log('Ride found:', ride.from, 'to', ride.to);

    // Increment seats and remove passenger
    console.log('Before ride update: seats', ride.seats, 'passengers', ride.passengers);
    ride.seats += 1;
    ride.passengers = ride.passengers.filter(
      (passengerId) => passengerId.toString() !== id
    );
    await ride.save();
    console.log('After ride update: seats', ride.seats, 'passengers', ride.passengers);

    // Remove ride from user's bookedRides
    console.log('Before user bookedRides update:', user.bookedRides);
    user.bookedRides = user.bookedRides.filter(
      (bookedRideId) => bookedRideId.toString() !== rideId
    );
    await user.save();
    console.log('After user bookedRides update:', user.bookedRides);

    const populatedUser = await User.findById(id).populate('bookedRides').populate('offeredRides');
    console.log('Successfully cancelled ride and populated user.');
    res.status(200).json({ message: 'Ride cancelled successfully', user: populatedUser });
  } catch (error) {
    console.error('Error in cancel-ride endpoint:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/:id/cancel-offered-ride/:rideId', async (req, res) => {
  try {
    const { id, rideId } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }

    // Remove ride from user's offeredRides
    user.offeredRides = user.offeredRides.filter(
      (offeredRideId) => offeredRideId.toString() !== rideId
    );
    await user.save();

    // Delete the ride itself
    await Ride.findByIdAndDelete(rideId);

    const populatedUser = await User.findById(id).populate('bookedRides').populate('offeredRides');
    res.status(200).json({ message: 'Offered ride cancelled successfully', user: populatedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/users/:id/offer-ride', async (req, res) => {
  try {
    const { id } = req.params;
    const { rideId } = req.body;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.offeredRides.push(rideId);
    await user.save();
    res.status(200).json({ message: 'Ride offered successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ride Routes
app.post('/api/rides', async (req, res) => {
  try {
    const newRide = new Ride(req.body);
    await newRide.save();
    res.status(201).json({ message: 'Ride created successfully', ride: newRide });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/rides', async (req, res) => {
  try {
    const { userId } = req.query;
    console.log(`Backend: Received request for rides. userId query: ${userId}`);
    let query = {};
    if (userId) {
      query.userId = userId;
    }
    const rides = await Ride.find(query);
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/rides/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findById(id);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found' });
    }
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/rides/all', async (req, res) => {
  try {
    await Ride.deleteMany({});
    res.status(200).json({ message: 'All rides deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/users/clear-booked-rides', async (req, res) => {
  try {
    await User.updateMany({}, { $set: { bookedRides: [] } });
    res.status(200).json({ message: 'All booked rides cleared for all users' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
