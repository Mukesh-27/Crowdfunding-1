const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['creator', 'backer'], required: true },
  location: String,
  bio: String,
  website: String,
  newsletter: Boolean,
  socialLinks: {
    twitter: String,
    instagram: String,
    linkedin: String
  },
  // Backer specific fields
  paymentInfo: {
    cardNumber: String,
    expiryDate: String,
    billingAddress: String
  },
  preferredCategories: [String],
  notificationPreferences: {
    projectUpdates: { type: Boolean, default: true },
    newProjects: { type: Boolean, default: true },
    successfulFunding: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
