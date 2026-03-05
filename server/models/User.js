const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name.'],
    minlength: 2,
    maxlength: 50,
  },

  email: {
    type: String,
    required: [true, 'Please provide an email.'],
    unique: true,
    lowercase: true,
    trim: true,
  },

  password: {
    type: String,
    required: [true, 'Please provide a password.'],
    minlength: 5,
  },
});

// Runs before the user is saved to the DB
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return; // Only hash the password if it has been modified (prevents re-hashing on updates)

  const salt = await bcrypt.genSalt(10); // Higher = More expensive = More secure
  this.password = await bcrypt.hash(this.password, salt); // Replace the plain text password with its hashed version before saving
});

// Creates a signed JWT token so the server can authenticate the user
UserSchema.methods.createJWT = function () {
  return jwt.sign({ userId: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

// Checks to see if the hashed password matches the stored one
UserSchema.methods.comparePassword = async function (candidatePassword) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
