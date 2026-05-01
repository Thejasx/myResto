const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  quantity: { type: String, default: '1 serving' },
  priceInr: { type: Number, required: true },
  isVeg: { type: Boolean, default: true },
  isAvailable: { type: Boolean, default: true },
  image: { type: String, default: '' },
  isPopular: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('MenuItem', menuItemSchema);
