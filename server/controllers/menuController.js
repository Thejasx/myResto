const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

// @desc    Get menu for a restaurant
// @route   GET /api/menus/:restaurantId
const getMenu = async (req, res) => {
  try {
    const menu = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Add menu item
// @route   POST /api/menus
const addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user._id });
    if (!restaurant) return res.status(404).json({ message: 'No restaurant found for this owner' });

    const item = await MenuItem.create({ ...req.body, restaurantId: restaurant._id });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Update menu item
// @route   PUT /api/menus/:id
const updateMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('restaurantId');
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    if (item.restaurantId.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    const updated = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc    Delete menu item
// @route   DELETE /api/menus/:id
const deleteMenuItem = async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id).populate('restaurantId');
    if (!item) return res.status(404).json({ message: 'Menu item not found' });
    if (item.restaurantId.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });

    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMenu, addMenuItem, updateMenuItem, deleteMenuItem };
