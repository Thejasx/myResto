const mongoose = require('mongoose');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Review = require('../models/Review');

// @desc    Get all approved restaurants (with filters)
// @route   GET /api/restaurants
const getRestaurants = async (req, res) => {
  try {
    const { city, cuisine, priceRange, rating, sort, page = 1, limit = 12 } = req.query;
    const query = { approvalStatus: 'approved', isActive: true };

    if (city) query.city = { $regex: city.trim(), $options: 'i' };
    if (cuisine) query.cuisines = { $in: [new RegExp(cuisine, 'i')] };
    if (priceRange) query.priceRange = priceRange;
    if (rating) query.averageRating = { $gte: parseFloat(rating) };

    let sortObj = { createdAt: -1 };
    if (sort === 'rating') sortObj = { averageRating: -1 };
    else if (sort === 'price_low') sortObj = { priceForTwo: 1 };
    else if (sort === 'price_high') sortObj = { priceForTwo: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Restaurant.countDocuments(query);
    const restaurants = await Restaurant.find(query).sort(sortObj).skip(skip).limit(parseInt(limit));

    res.json({ restaurants, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Search restaurants
// @route   GET /api/restaurants/search
const searchRestaurants = async (req, res) => {
  try {
    const { city, date, time, people, cuisine, priceRange, rating, sort } = req.query;
    const query = { approvalStatus: 'approved', isActive: true };

    if (city) query.city = { $regex: city.trim(), $options: 'i' };
    if (cuisine) query.cuisines = { $in: [new RegExp(cuisine, 'i')] };
    if (priceRange) query.priceRange = priceRange;
    if (rating) query.averageRating = { $gte: parseFloat(rating) };
    if (people) query.seatingCapacity = { $gte: parseInt(people) };

    let sortObj = { averageRating: -1 };
    if (sort === 'price_low') sortObj = { priceForTwo: 1 };
    else if (sort === 'price_high') sortObj = { priceForTwo: -1 };
    else if (sort === 'rating') sortObj = { averageRating: -1 };

    const restaurants = await Restaurant.find(query).sort(sortObj).limit(50);
    res.json({ restaurants, total: restaurants.length, city: city || '' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
const getRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('ownerId', 'name email');
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    const menu = await MenuItem.find({ restaurantId: restaurant._id, isAvailable: true });
    const reviews = await Review.find({ restaurantId: restaurant._id }).sort({ createdAt: -1 });
    res.json({ restaurant, menu, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Create restaurant (owner)
// @route   POST /api/restaurants
const createRestaurant = async (req, res) => {
  try {
    const existing = await Restaurant.findOne({ ownerId: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already have a registered restaurant. Please edit the existing one.' });

    const data = { ...req.body, ownerId: req.user._id, ownerName: req.user.name, email: req.user.email, city: req.body.city?.toLowerCase().trim() };
    const restaurant = await Restaurant.create(data);
    res.status(201).json(restaurant);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update restaurant (owner)
// @route   PUT /api/restaurants/:id
const updateRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    if (req.body.city) req.body.city = req.body.city.toLowerCase().trim();
    const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete restaurant (owner/admin)
// @route   DELETE /api/restaurants/:id
const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    if (restaurant.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    await MenuItem.deleteMany({ restaurantId: req.params.id });
    await Restaurant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get owner's restaurant
// @route   GET /api/restaurants/owner/mine
const getOwnerRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) return res.status(404).json({ message: 'No restaurant found for this owner' });
    const menu = await MenuItem.find({ restaurantId: restaurant._id });
    res.json({ restaurant, menu });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get featured / popular restaurants
// @route   GET /api/restaurants/featured
const getFeatured = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ approvalStatus: 'approved', isActive: true })
      .sort({ averageRating: -1 }).limit(8);
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Get popular cities
// @route   GET /api/restaurants/cities
const getPopularCities = async (req, res) => {
  try {
    const cities = await Restaurant.aggregate([
      { $match: { approvalStatus: 'approved', isActive: true } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);
    res.json(cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add a review
// @route   POST /api/restaurants/:id/reviews
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.create({
      restaurantId: req.params.id,
      userId: req.user._id,
      userName: req.user.name,
      rating: parseInt(rating),
      comment
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRestaurants, searchRestaurants, getRestaurant, createRestaurant, updateRestaurant, deleteRestaurant, getOwnerRestaurant, getFeatured, getPopularCities, addReview };
