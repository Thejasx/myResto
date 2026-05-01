const express = require('express');
const router = express.Router();
const {
  getStats, getAllUsers, getAllOwners, getAllRestaurants,
  approveRestaurant, rejectRestaurant, deleteRestaurant,
  deleteUser, getAllBookings, toggleUserStatus
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/owners', getAllOwners);
router.get('/restaurants', getAllRestaurants);
router.get('/bookings', getAllBookings);
router.put('/restaurants/:id/approve', approveRestaurant);
router.put('/restaurants/:id/reject', rejectRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);
router.delete('/users/:id', deleteUser);
router.delete('/owners/:id', deleteUser);
router.put('/users/:id/toggle', toggleUserStatus);

module.exports = router;
