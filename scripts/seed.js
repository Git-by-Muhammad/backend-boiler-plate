require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/user.model');
const Product = require('../src/models/product.model');
const Item = require('../src/models/item.model');

const args = process.argv.slice(2);
const shouldReset = args.includes('--reset');

async function upsertAdmin() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@12345';
  const adminName = process.env.SEED_ADMIN_NAME || 'System Admin';

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await User.findOneAndUpdate(
    { email: adminEmail },
    { email: adminEmail, name: adminName, role: 'admin', passwordHash },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seedData() {
  const existingProducts = await Product.countDocuments();
  if (!existingProducts) {
    await Product.insertMany([
      { name: 'Starter Product', description: 'Seed product', price: 99.99, stock: 20, active: true },
      { name: 'Pro Product', description: 'Seed pro product', price: 199.99, stock: 10, active: true },
    ]);
  }

  const existingItems = await Item.countDocuments();
  if (!existingItems) {
    await Item.insertMany([
      { name: 'Starter Item', description: 'Seed item for quick testing' },
      { name: 'Extra Item', description: 'Another seed item' },
    ]);
  }
}

async function resetCollections() {
  await Promise.all([
    User.deleteMany({}),
    Product.deleteMany({}),
    Item.deleteMany({}),
  ]);
}

async function run() {
  try {
    await connectDB();
    if (shouldReset) {
      await resetCollections();
      console.log('Collections reset complete.');
    }
    await upsertAdmin();
    await seedData();
    console.log('Seeding completed.');
  } catch (err) {
    console.error('Seeding failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
}

run();

