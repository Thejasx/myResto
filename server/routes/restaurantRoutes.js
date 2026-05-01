const express = require('express');
const router = express.Router();
const {
  getRestaurants, searchRestaurants, getRestaurant,
  createRestaurant, updateRestaurant, deleteRestaurant,
  getOwnerRestaurant, getFeatured, getPopularCities, addReview
} = require('../controllers/restaurantController');
const { protect, ownerOnly } = require('../middleware/auth');

router.get('/', getRestaurants);
router.get('/search', searchRestaurants);
router.get('/featured', getFeatured);
router.get('/cities', getPopularCities);
router.get('/owner/mine', protect, ownerOnly, getOwnerRestaurant);
router.get('/:id', getRestaurant);
router.post('/:id/reviews', protect, addReview);
router.post('/', protect, ownerOnly, createRestaurant);
router.put('/:id', protect, ownerOnly, updateRestaurant);
router.delete('/:id', protect, ownerOnly, deleteRestaurant);

module.exports = router;
