const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function makeAdmin() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  const email = "adminnr@gmail.com";
  let user = await User.findOne({ email });

  const passwordHash = await bcrypt.hash("admin1234", 10);
  if (!user) {
    user = new User({
      name: "Admin User",
      email,
      passwordHash,
      role: "admin"
    });
    await user.save();
    console.log("Admin user created: adminnr@gmail.com / admin1234");
  } else {
    user.role = "admin";
    user.passwordHash = passwordHash;
    await user.save();
    console.log("Existing user updated to admin with admin1234.");
  }

  mongoose.disconnect();
}

makeAdmin();
