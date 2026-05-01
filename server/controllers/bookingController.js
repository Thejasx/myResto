const Booking = require('../models/Booking');
const Restaurant = require('../models/Restaurant');

// @desc    Create booking
// @route   POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { restaurantId, bookingDate, bookingTime, peopleCount, specialRequest, contactPhone, contactName, menuItems } = req.body;

    if (!restaurantId || !bookingDate || !bookingTime || !peopleCount || !contactPhone || !contactName)
      return res.status(400).json({ message: 'Please fill all required booking fields' });

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    if (restaurant.approvalStatus !== 'approved') return res.status(400).json({ message: 'Restaurant is not accepting bookings' });

    // Check existing bookings for the same slot
    const existingBookings = await Booking.find({
      restaurantId,
      bookingDate,
      bookingTime,
      status: { $in: ['pending', 'confirmed'] }
    });

    const totalBooked = existingBookings.reduce((sum, b) => sum + b.peopleCount, 0);
    if (totalBooked + parseInt(peopleCount) > restaurant.seatingCapacity)
      return res.status(400).json({ message: `Not enough capacity. Only ${restaurant.seatingCapacity - totalBooked} seats available for this slot.` });

    const booking = await Booking.create({
      userId: req.user._id,
      restaurantId,
      bookingDate,
      bookingTime,
      peopleCount: parseInt(peopleCount),
      specialRequest,
      contactPhone,
      contactName,
      menuItems: menuItems || [],
      status: 'confirmed'
    });

    const populated = await Booking.findById(booking._id)
      .populate('restaurantId', 'name city address phone images')
      .populate('userId', 'name email');

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get my bookings (customer)
// @route   GET /api/bookings/my
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('restaurantId', 'name city address phone images cuisines')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Cancel booking (customer)
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.userId.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });
    if (booking.status === 'cancelled')
      return res.status(400).json({ message: 'Booking already cancelled' });

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get restaurant bookings (owner)
// @route   GET /api/bookings/restaurant
const getRestaurantBookings = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) return res.status(404).json({ message: 'No restaurant found' });

    const bookings = await Booking.find({ restaurantId: restaurant._id })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update booking status (owner)
// @route   PUT /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('restaurantId');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.restaurantId.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    booking.status = req.body.status;
    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking, getRestaurantBookings, updateBookingStatus };
