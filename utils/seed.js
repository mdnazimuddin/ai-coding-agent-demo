const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

let User;
try {
  User = require('../src/models/user.model');
} catch (error) {
  const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, unique: true, lowercase: true, trim: true },
      age: { type: Number, min: 0 },
      phone: { type: String, trim: true },
      role: { type: String, enum: ['user', 'admin'], default: 'user' },
      isActive: { type: Boolean, default: true }
    },
    { timestamps: true }
  );
  User = mongoose.models.User || mongoose.model('User', userSchema);
}

const sampleUsers = [
  {
    name: 'Rahim Ahmed',
    email: 'rahim.ahmed@example.com',
    age: 28,
    phone: '+8801712345678',
    role: 'user',
    isActive: true
  },
  {
    name: 'Karim Hossain',
    email: 'karim.hossain@example.com',
    age: 35,
    phone: '+8801812345678',
    role: 'admin',
    isActive: true
  }
];

const seedDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/simple_crud_db';

  try {
    console.log('Connecting to MongoDB for seeding...');
    await mongoose.connect(mongoUri);
    console.log(`Connected to MongoDB at ${mongoUri}`);

    console.log('Truncating existing user records...');
    await User.deleteMany({});
    console.log('User collection cleared.');

    console.log('Seeding mock user data...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`Successfully seeded ${createdUsers.length} users:`);
    createdUsers.forEach((user) => {
      console.log(` - ID: ${user._id} | Name: ${user.name} | Email: ${user.email} | Role: ${user.role}`);
    });

    console.log('Database seeding completed successfully.');
  } catch (error) {
    console.error('Error during database seeding:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB connection closed.');
  }
};

if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleUsers };
