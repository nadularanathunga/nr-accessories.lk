const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function makeAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const email = "admin@nr-accessories.lk";
  let user = await User.findOne({ email });

  if (!user) {
    const passwordHash = await bcrypt.hash("admin123", 10);
    user = new User({
      name: "Admin User",
      email,
      passwordHash,
      role: "admin"
    });
    await user.save();
    console.log("Admin user created: admin@nr-accessories.lk / admin123");
  } else {
    user.role = "admin";
    await user.save();
    console.log("Existing user made admin.");
  }

  mongoose.disconnect();
}

makeAdmin();
