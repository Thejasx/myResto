const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  bookingDate: { type: String, required: true },
  bookingTime: { type: String, required: true },
  peopleCount: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'completed'], default: 'pending' },
  specialRequest: { type: String, default: '' },
  contactPhone: { type: String, required: true },
  contactName: { type: String, required: true },
  menuItems: [{
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem' },
    name: { type: String },
    price: { type: Number },
    quantity: { type: Number, default: 1 }
  }],
  totalAmount: { type: Number, default: 0 },
  bookingRef: { type: String, unique: true },
}, { timestamps: true });

bookingSchema.pre('save', function (next) {
  if (!this.bookingRef) {
    this.bookingRef = 'MR' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
