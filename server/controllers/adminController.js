const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Booking = require('../models/Booking');
const MenuItem = require('../models/MenuItem');


const getStats = async (req, res) => {
  try {
    const [totalUsers, totalOwners, totalRestaurants, approvedRestaurants, pendingRestaurants, rejectedRestaurants, totalBookings] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'owner' }),
      Restaurant.countDocuments(),
      Restaurant.countDocuments({ approvalStatus: 'approved' }),
      Restaurant.countDocuments({ approvalStatus: 'pending' }),
      Restaurant.countDocuments({ approvalStatus: 'rejected' }),
      Booking.countDocuments()
    ]);
    res.json({ totalUsers, totalOwners, totalRestaurants, approvedRestaurants, pendingRestaurants, rejectedRestaurants, totalBookings });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: 'owner' }).select('-password').sort({ createdAt: -1 });
    res.json(owners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllRestaurants = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { approvalStatus: status } : {};
    const restaurants = await Restaurant.find(query).populate('ownerId', 'name email phone').sort({ createdAt: -1 });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const approveRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { approvalStatus: 'approved' }, { new: true });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant approved', restaurant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const rejectRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, { approvalStatus: 'rejected' }, { new: true });
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    res.json({ message: 'Restaurant rejected', restaurant });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
    await MenuItem.deleteMany({ restaurantId: req.params.id });
    res.json({ message: 'Restaurant deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'admin') return res.status(400).json({ message: 'Cannot delete admin' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('restaurantId', 'name city')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getStats, getAllUsers, getAllOwners, getAllRestaurants, approveRestaurant, rejectRestaurant, deleteRestaurant, deleteUser, getAllBookings, toggleUserStatus };
