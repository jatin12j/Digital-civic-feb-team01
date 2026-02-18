const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    // Password is not required if using Google Auth
    required: function () {
      return !this.googleId;
    }
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true // Allows multiple users without googleId (null/undefined)
  },
  role: {
    type: String,
    enum: ['citizen', 'official', 'admin'],
    default: 'citizen',
  },
  location: {
    type: String,
    default: ''
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  governmentId: {
    type: String,
    default: ''
  },
  verificationDocument: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Pre-save hook to hash password
// Pre-save hook to hash password
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }

  // Only hash if password exists (it might be empty for Google Auth users)
  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
