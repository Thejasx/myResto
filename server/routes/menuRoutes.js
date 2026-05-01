const express = require('express');
const router = express.Router();
const { getMenu, addMenuItem, updateMenuItem, deleteMenuItem } = require('../controllers/menuController');
const { protect, ownerOnly } = require('../middleware/auth');

router.get('/:restaurantId', getMenu);
router.post('/', protect, ownerOnly, addMenuItem);
router.put('/:id', protect, ownerOnly, updateMenuItem);
router.delete('/:id', protect, ownerOnly, deleteMenuItem);

module.exports = router;
