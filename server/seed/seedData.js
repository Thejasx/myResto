const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

const MONGO_URI = process.env.MONGO_URI;

const restaurantsData = [
  {
    name: 'Spice Garden', city: 'mumbai', location: 'Bandra West, Mumbai', address: '12 Hill Road, Bandra West, Mumbai - 400050',
    phone: '+91 98200 12345', description: 'Authentic North Indian cuisine with a modern twist. Experience the rich flavors of Punjab.',
    cuisines: ['North Indian', 'Mughlai'], openingTime: '11:00', closingTime: '23:00',
    seatingCapacity: 120, totalTables: 20, priceRange: 'moderate', priceForTwo: 1200,
    images: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'],
    features: ['WiFi', 'Parking', 'AC', 'Live Music'],
  },
  {
    name: 'The Coastal Kitchen', city: 'mumbai', location: 'Juhu Beach, Mumbai', address: '45 Juhu Tara Road, Mumbai - 400049',
    phone: '+91 98200 54321', description: 'Fresh seafood and coastal delicacies served with an ocean view.',
    cuisines: ['Seafood', 'Continental'], openingTime: '12:00', closingTime: '22:30',
    seatingCapacity: 80, totalTables: 15, priceRange: 'premium', priceForTwo: 2500,
    images: ['https://images.unsplash.com/photo-1534482421-64566f976cfa?w=800'],
    features: ['Ocean View', 'WiFi', 'Valet Parking'],
  },
  {
    name: 'Biryani House', city: 'delhi', location: 'Connaught Place, Delhi', address: 'N-14 CP, New Delhi - 110001',
    phone: '+91 98100 11223', description: 'Delhi\'s most celebrated biryani destination. Slow-cooked dum biryani.',
    cuisines: ['Mughlai', 'North Indian'], openingTime: '10:00', closingTime: '23:30',
    seatingCapacity: 150, totalTables: 25, priceRange: 'budget', priceForTwo: 700,
    images: ['https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=800'],
    features: ['Takeaway', 'Delivery', 'AC'],
  },
  {
    name: 'Dosa Plaza', city: 'bangalore', location: 'Koramangala, Bangalore', address: '80 Feet Road, Koramangala - 560034',
    phone: '+91 98450 44556', description: 'Over 108 varieties of dosas. A South Indian paradise.',
    cuisines: ['South Indian'], openingTime: '07:00', closingTime: '22:00',
    seatingCapacity: 100, totalTables: 18, priceRange: 'budget', priceForTwo: 400,
    images: ['https://images.unsplash.com/photo-1630383249896-424e482df921?w=800'],
    features: ['Pure Veg', 'Quick Service'],
  },
  {
    name: 'Olive Bistro', city: 'goa', location: 'Calangute, Goa', address: 'Calangute Beach Road, Goa - 403516',
    phone: '+91 99200 88776', description: 'Mediterranean-inspired dining on the shores of Goa.',
    cuisines: ['Continental', 'Seafood'], openingTime: '10:00', closingTime: '01:00',
    seatingCapacity: 100, totalTables: 20, priceRange: 'luxury', priceForTwo: 4000,
    images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800'],
    features: ['Beach View', 'Bar', 'Live Music'],
  },
  {
    name: 'Dragon Palace', city: 'chennai', location: 'Anna Nagar, Chennai', address: '2nd Avenue, Chennai - 600040',
    phone: '+91 98400 33445', description: 'Exquisite Chinese cuisine featuring dim sums and Peking duck.',
    cuisines: ['Chinese'], openingTime: '11:30', closingTime: '22:30',
    seatingCapacity: 90, totalTables: 16, priceRange: 'moderate', priceForTwo: 1500,
    images: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800'],
    features: ['WiFi', 'AC', 'Takeaway'],
  },
  {
    name: 'Hyderabadi Dawat', city: 'hyderabad', location: 'Banjara Hills, Hyderabad', address: 'Road No 12, Hyderabad - 500034',
    phone: '+91 98850 66778', description: 'The royal taste of Hyderabadi cuisine. Dum biryani and haleem.',
    cuisines: ['Mughlai', 'North Indian'], openingTime: '11:00', closingTime: '23:00',
    seatingCapacity: 200, totalTables: 35, priceRange: 'moderate', priceForTwo: 1000,
    images: ['https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800'],
    features: ['Banquet Hall', 'Parking', 'Catering'],
  },
  {
    name: 'The Grand Thali', city: 'pune', location: 'FC Road, Pune', address: 'FC Road, Pune - 411004',
    phone: '+91 98220 99001', description: 'An unlimited thali experience celebrating Maharashtra and Rajasthan.',
    cuisines: ['North Indian', 'South Indian'], openingTime: '11:00', closingTime: '22:00',
    seatingCapacity: 80, totalTables: 14, priceRange: 'budget', priceForTwo: 600,
    images: ['https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800'],
    features: ['Pure Veg', 'Unlimited Thali'],
  },
];

const menuTemplates = [
  { name: 'Butter Chicken', category: 'Main Course', priceInr: 380, isVeg: false, isPopular: true },
  { name: 'Paneer Butter Masala', category: 'Main Course', priceInr: 320, isVeg: true, isPopular: true },
  { name: 'Dal Makhani', category: 'Main Course', priceInr: 280, isVeg: true, isPopular: true },
  { name: 'Chicken Biryani', category: 'Main Course', priceInr: 350, isVeg: false, isPopular: true },
  { name: 'Garlic Naan', category: 'Breads', priceInr: 80, isVeg: true, isPopular: false },
  { name: 'Veg Hakka Noodles', category: 'Chinese', priceInr: 220, isVeg: true, isPopular: true },
  { name: 'Chicken Manchurian', category: 'Chinese', priceInr: 300, isVeg: false, isPopular: true },
  { name: 'Masala Dosa', category: 'South Indian', priceInr: 120, isVeg: true, isPopular: true },
  { name: 'Margherita Pizza', category: 'Italian', priceInr: 450, isVeg: true, isPopular: true },
  { name: 'Grilled Fish', category: 'Seafood', priceInr: 550, isVeg: false, isPopular: true },
  { name: 'Gulab Jamun', category: 'Desserts', priceInr: 90, isVeg: true, isPopular: false },
  { name: 'Mango Lassi', category: 'Beverages', priceInr: 100, isVeg: true, isPopular: true },
];

const comments = [
  "Amazing food! The flavors were spot on.",
  "Great ambiance and fast service. Highly recommend.",
  "The biryani was out of this world! Must try.",
  "A bit expensive but worth it for the view.",
  "Authentic taste. Reminded me of home.",
  "Service was a bit slow, but the food made up for it.",
  "Best place for a family dinner. Very spacious.",
  "Pure veg heaven! The thali was massive.",
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear everything
    await User.deleteMany({ role: { $ne: 'admin' } });
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    console.log('🗑️  Cleared old data');

    // Create Demo Customer
    const customer = await User.create({
      name: 'Rahul Sharma', email: 'customer@demo.com', password: 'password123',
      phone: '9876543210', role: 'customer'
    });
    console.log('👤 Created Demo Customer');

    // Create Restaurants, Owners, Menu, and Reviews
    for (let i = 0; i < restaurantsData.length; i++) {
      const r = restaurantsData[i];
      
      // Create Owner
      const owner = await User.create({
        name: `Owner of ${r.name}`, email: `owner${i+1}@demo.com`,
        password: 'password123', phone: r.phone, role: 'owner'
      });

      // Create Restaurant
      const resto = await Restaurant.create({
        ...r, ownerId: owner._id, ownerName: owner.name,
        email: owner.email, approvalStatus: 'approved'
      });

      // Create Menu Items
      const menu = await MenuItem.insertMany(menuTemplates.map(m => ({
        ...m, restaurantId: resto._id, 
        description: `Delicious ${m.name} prepared with fresh ingredients.`,
        quantity: m.category === 'Breads' ? '1 pc' : '1 serving',
        image: `https://source.unsplash.com/400x300/?${m.name.replace(/ /g, ',')},food`
      })));

      // Create Reviews
      for (let j = 0; j < 3; j++) {
        await Review.create({
          userId: customer._id, userName: customer.name,
          restaurantId: resto._id, rating: 4 + Math.floor(Math.random() * 2),
          comment: comments[Math.floor(Math.random() * comments.length)]
        });
      }

      // Create a Booking for each with some items
      const selected = menu.slice(0, 3).map(m => ({
        itemId: m._id, name: m.name, price: m.priceInr, quantity: 1
      }));
      
      await Booking.create({
        userId: customer._id, restaurantId: resto._id,
        bookingDate: '2026-05-10', bookingTime: '19:30',
        peopleCount: 2, contactName: customer.name, contactPhone: customer.phone,
        status: 'confirmed', menuItems: selected,
        totalAmount: selected.reduce((s, x) => s + x.price, 0)
      });

      console.log(`🍽️  Seeded: ${r.name}`);
    }

    console.log('\n✨ All data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  }
}

seed();
