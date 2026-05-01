const express = require('express');
const router = express.Router();
const {
  createBooking, getMyBookings, cancelBooking,
  getRestaurantBookings, updateBookingStatus
} = require('../controllers/bookingController');
const { protect, ownerOnly } = require('../middleware/auth');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/restaurant', protect, ownerOnly, getRestaurantBookings);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, ownerOnly, updateBookingStatus);

module.exports = router;
