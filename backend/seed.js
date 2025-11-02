const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

// 🐟 Local fish image-based products
const products = [
  {
    name: 'Catla',
    category: 'freshwater',
    description: 'Large freshwater fish with rich flavor; best for thick curries.',
    price: 450,
    cuts: [
      { name: 'Steaks', extraCost: 50 },
      { name: 'Whole', extraCost: 0 }
    ],
    usages: ['Curry', 'Smoke'],
    images: ['https://fishmart-fullstack-jj.onrender.com/uploads/catla.jpg']
  },
  {
    name: 'Crab',
    category: 'misc',
    description: 'Sweet and juicy crab meat, great for curry or steaming.',
    price: 1000,
    cuts: [
      { name: 'Whole', extraCost: 0 },
      { name: 'Cleaned', extraCost: 80 }
    ],
    usages: ['Fry', 'Curry', 'Grill'],
    images: ['https://fishmart-fullstack-jj.onrender.com/uploads/crab.jpg']
  },
  {
    name: 'Mackerel',
    category: 'seawater',
    description: 'Firm-textured seawater fish, great for curries, grilling, and pan-frying.',
    price: 650,
    cuts: [
      { name: 'Whole', extraCost: 0 },
      { name: 'Steaks', extraCost: 50 },
      { name: 'Fillet', extraCost: 100 }
    ],
    usages: ['Curry', 'Grill', 'Fry'],
    images: ['https://fishmart-fullstack-jj.onrender.com/uploads/mackrel.jpg']
  },
  {
    name: 'Pomfret',
    category: 'seawater',
    description: 'A delicate and flavorful fish, ideal for frying or mild curry.',
    price: 800,
    cuts: [
      { name: 'Whole', extraCost: 0 },
      { name: 'Cleaned', extraCost: 30 }
    ],
    usages: ['Fry', 'Curry'],
    images: ['https://fishmart-fullstack-jj.onrender.com/uploads/pomfret.jpg']
  },
  {
    name: 'Prawns',
    category: 'misc',
    description: 'Premium prawns, perfect for grill, curry or fry.',
    price: 1200,
    cuts: [
      { name: 'Whole', extraCost: 0 },
      { name: 'Peeled & Cleaned', extraCost: 100 }
    ],
    usages: ['Curry', 'Fry', 'Grill'],
    images: ['https://fishmart-fullstack-jj.onrender.com/uploads/prawns.jpg']
  },
  {
    name: 'Rohu',
    category: 'freshwater',
    description: 'Soft and flaky freshwater fish used widely in Bengali curries.',
    price: 400,
    cuts: [
      { name: 'Whole', extraCost: 0 },
      { name: 'Steaks', extraCost: 40 }
    ],
    usages: ['Curry', 'Steam', 'Fry'],
    images: ['https://fishmart-fullstack-jj.onrender.com/uploads/rohu.jpg']
  },
  {
    name: 'Seer Fish (Surmai)',
    category: 'seawater',
    description: 'Popular fish with firm meat, loved for grill and spicy curries.',
    price: 950,
    cuts: [
      { name: 'Steaks', extraCost: 50 },
      { name: 'Fillet', extraCost: 120 }
    ],
    usages: ['Grill', 'Curry', 'Fry'],
    images: ['https://fishmart-fullstack-jj.onrender.com/uploads/seer.jpg']
  },
  {
    name: 'Squid',
    category: 'misc',
    description: 'Tender squid rings, perfect for frying or curry.',
    price: 700,
    cuts: [
      { name: 'Rings', extraCost: 0 },
      { name: 'Tubes', extraCost: 0 }
    ],
    usages: ['Fry', 'Curry'],
    images: ['https://fishmart-fullstack-jj.onrender.com/uploads/squid.jpg']
  },
  {
    name: 'Tilapia',
    category: 'freshwater',
    description: 'Mild-tasting versatile fish, suitable for pan-frying and grilling.',
    price: 350,
    cuts: [
      { name: 'Fillet', extraCost: 50 },
      { name: 'Whole', extraCost: 0 }
    ],
    usages: ['Fry', 'Grill', 'Bake'],
    images: ['https://fishmart-fullstack-jj.onrender.com/uploads/tilapia.jpg']
  }
];

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB Connected');

    await Product.deleteMany({});
    console.log('🧹 Cleared old data');

    const result = await Product.insertMany(products);
    console.log(`✅ Inserted ${result.length} fish products successfully!`);

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('❌ Error seeding data:', err);
  });
