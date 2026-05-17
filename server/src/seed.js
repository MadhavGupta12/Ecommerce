import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import Category from './models/Category.js';
import Order from './models/Order.js';
import Product from './models/Product.js';
import User from './models/User.js';

dotenv.config();
await connectDB();

await Promise.all([Order.deleteMany(), Product.deleteMany(), Category.deleteMany(), User.deleteMany()]);

const admin = await User.create({
  name: 'Admin User',
  email: 'admin@luxehaven.dev',
  password: 'password123',
  role: 'admin'
});

await User.create({
  name: 'Demo Customer',
  email: 'customer@luxehaven.dev',
  password: 'password123',
  role: 'customer'
});

const categories = await Category.insertMany([
  { name: 'Furniture', description: 'Statement furniture for modern homes' },
  { name: 'Lighting', description: 'Warm lighting for layered interiors' },
  { name: 'Decor', description: 'Curated accents and finishing pieces' }
]);

await Product.insertMany([
  {
    name: 'Aurora Lounge Chair',
    brand: 'LuxeHaven Studio',
    category: categories[0]._id,
    description: 'A sculptural accent chair with kiln-dried hardwood framing and plush boucle upholstery.',
    image: '/uploads/chair.jpg',
    price: 429,
    countInStock: 12,
    rating: 4.7,
    numReviews: 18,
    featured: true
  },
  {
    name: 'Solstice Floor Lamp',
    brand: 'Northline',
    category: categories[1]._id,
    description: 'A brass floor lamp with diffused glass globe and dimmable ambient light.',
    image: '/uploads/lamp.jpg',
    price: 189,
    countInStock: 24,
    rating: 4.5,
    numReviews: 11
  },
  {
    name: 'Marble Nesting Trays',
    brand: 'Casa Vale',
    category: categories[2]._id,
    description: 'A set of two honed marble trays for consoles, coffee tables, and dressers.',
    image: '/uploads/trays.jpg',
    price: 74,
    countInStock: 32,
    rating: 4.3,
    numReviews: 9
  }
]);

console.log(`Seeded LuxeHaven with admin ${admin.email}`);
process.exit(0);
