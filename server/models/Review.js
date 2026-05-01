const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  images: [{ type: String }],
  userName: { type: String }, // For easier display
}, { timestamps: true });

// Update restaurant rating after a review is saved
reviewSchema.post('save', async function () {
  const Restaurant = mongoose.model('Restaurant');
  const reviews = await this.constructor.find({ restaurantId: this.restaurantId });
  
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Restaurant.findByIdAndUpdate(this.restaurantId, {
    averageRating: avg,
    totalReviews: reviews.length
  });
});

module.exports = mongoose.model('Review', reviewSchema);
