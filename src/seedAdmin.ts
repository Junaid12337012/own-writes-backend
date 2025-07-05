import mongoose from 'mongoose';
import User from './models/User';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ownwrites';

async function seedAdmin() {
  await mongoose.connect(MONGO_URI);

  const adminExists = await User.findOne({ role: 'admin' });
  if (adminExists) {
    console.log('Admin user already exists:', adminExists.username);
    await mongoose.disconnect();
    return;
  }

  const admin = new User({
    username: 'admin',
    email: 'admin@example.com',
    password: '$2a$10$abcdefghijklmnopqrstuv', // Replace with a real bcrypt hash
    role: 'admin',
    createdAt: new Date()
  });
  await admin.save();
  console.log('Admin user created:', admin.username);
  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error('Error seeding admin:', err);
  mongoose.disconnect();
});
