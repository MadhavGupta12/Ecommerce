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
  name: process.env.ADMIN_NAME || 'Admin User',
  email: process.env.ADMIN_EMAIL || 'admin@luxehaven.dev',
  password: process.env.ADMIN_PASSWORD || 'password123',
  role: 'admin'
});

await User.create({
  name: 'Demo Customer',
  email: 'customer@luxehaven.dev',
  password: 'password123',
  role: 'customer'
});

const categories = await Category.insertMany([
  { name: 'Furniture', description: 'Sofas, chairs, tables, and storage pieces' },
  { name: 'Lighting', description: 'Warm lamps and sculptural fixtures' },
  { name: 'Decor', description: 'Textiles, trays, mirrors, and accents' },
  { name: 'Bedroom', description: 'Soft bedroom essentials and nightstands' }
]);

await Product.insertMany([
  {
    name: 'Aurora Lounge Chair',
    brand: 'LuxeHaven Studio',
    category: categories[0]._id,
    description: 'A sculptural lounge chair with a curved hardwood frame, deep seat, and soft boucle upholstery made for reading corners.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
    price: 429,
    countInStock: 12,
    rating: 4.7,
    numReviews: 18,
    featured: true
  },
  {
    name: 'Marlow Velvet Sofa',
    brand: 'Casa Vale',
    category: categories[0]._id,
    description: 'A low-profile three-seat sofa with performance velvet, generous cushions, and brass-finished tapered legs.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    price: 1199,
    countInStock: 6,
    rating: 4.8,
    numReviews: 27,
    featured: true
  },
  {
    name: 'Haven Oak Coffee Table',
    brand: 'Northline',
    category: categories[0]._id,
    description: 'A solid oak coffee table with softened edges, a lower display shelf, and a natural matte finish.',
    image: 'https://images.unsplash.com/photo-1532372320978-9d44f8ebfca7?auto=format&fit=crop&w=1200&q=80',
    price: 349,
    countInStock: 10,
    rating: 4.6,
    numReviews: 16
  },
  {
    name: 'Solstice Floor Lamp',
    brand: 'Northline',
    category: categories[1]._id,
    description: 'A brass floor lamp with a diffused glass globe and dimmable ambient light for evening rooms.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
    price: 189,
    countInStock: 24,
    rating: 4.5,
    numReviews: 11
  },
  {
    name: 'Aster Ceramic Table Lamp',
    brand: 'LuxeHaven Studio',
    category: categories[1]._id,
    description: 'A hand-glazed ceramic lamp with a linen drum shade and warm bedside glow.',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
    price: 144,
    countInStock: 18,
    rating: 4.4,
    numReviews: 14
  },
  {
    name: 'Marble Nesting Trays',
    brand: 'Casa Vale',
    category: categories[2]._id,
    description: 'A set of two honed marble trays for consoles, coffee tables, perfume bottles, and dresser styling.',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
    price: 74,
    countInStock: 32,
    rating: 4.3,
    numReviews: 9
  },
  {
    name: 'Alpine Wool Throw',
    brand: 'Hearth & Loom',
    category: categories[2]._id,
    description: 'A brushed wool-blend throw with quiet texture, finished fringe, and year-round comfort.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
    price: 96,
    countInStock: 21,
    rating: 4.6,
    numReviews: 22
  },
  {
    name: 'Orsay Round Mirror',
    brand: 'Maison Row',
    category: categories[2]._id,
    description: 'A slim metal-framed round mirror that brightens entryways, vanities, and compact living spaces.',
    image: 'https://images.unsplash.com/photo-1616486701797-0f33f61038ec?auto=format&fit=crop&w=1200&q=80',
    price: 212,
    countInStock: 13,
    rating: 4.7,
    numReviews: 19
  },
  {
    name: 'Washed Linen Duvet Set',
    brand: 'Hearth & Loom',
    category: categories[3]._id,
    description: 'A breathable linen duvet and pillowcase set with a relaxed, softly rumpled finish.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    price: 238,
    countInStock: 15,
    rating: 4.8,
    numReviews: 31,
    featured: true
  },
  {
    name: 'Walnut Cove Nightstand',
    brand: 'Northline',
    category: categories[3]._id,
    description: 'A compact walnut nightstand with a soft-close drawer and open shelf for everyday bedside storage.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    price: 279,
    countInStock: 9,
    rating: 4.5,
    numReviews: 12
  },
  {
    name: 'Fable Dining Chair',
    brand: 'Casa Vale',
    category: categories[0]._id,
    description: 'A curved-back dining chair with woven seat detailing and an easy silhouette for long dinners.',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
    price: 168,
    countInStock: 30,
    rating: 4.2,
    numReviews: 8
  },
  {
    name: 'Halo Wall Sconce',
    brand: 'Maison Row',
    category: categories[1]._id,
    description: 'A compact wall sconce with a milk-glass shade and warm brass armature for hallways and bedsides.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    price: 126,
    countInStock: 20,
    rating: 4.4,
    numReviews: 10
  }
]);

console.log(`Seeded LuxeHaven with admin ${admin.email}`);
process.exit(0);
