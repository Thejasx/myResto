const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  ownerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true, lowercase: true, trim: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  cuisines: [{ type: String }],
  images: [{ type: String }],
  openingTime: { type: String, required: true },
  closingTime: { type: String, required: true },
  seatingCapacity: { type: Number, required: true, default: 50 },
  totalTables: { type: Number, required: true, default: 10 },
  availableTables: { type: Number, default: 10 },
  priceRange: { type: String, enum: ['budget', 'moderate', 'premium', 'luxury'], default: 'moderate' },
  priceForTwo: { type: Number, default: 500 },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  mapLink: { type: String, default: '' },
  website: { type: String, default: '' },
  features: [{ type: String }],
}, { timestamps: true });

restaurantSchema.index({ city: 1, approvalStatus: 1 });
restaurantSchema.index({ name: 'text', description: 'text', city: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);
