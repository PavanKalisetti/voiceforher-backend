const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

// Define constants
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\d{10}$/, "Phone number must be 10 digits"],  // Validate 10-digit phone number
    },
    userType: {
      type: String,
      enum: ["girlUser", "authority"],
      required: [true, "User type is required"],
    },
    authorityType: {
      type: String,
      enum: ["caretaker", "warden", "dsw", "director"],
      required: function () {
        return this.userType === "authority";
      },
    },
    education: {
      type: String,
      required: function () {
        return this.userType === "girlUser"; // Only for girlUser
      },
    },
    isApproved: {
      type: Boolean,
      default: function () {
        return this.userType === "girlUser";
      },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to validate password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate a password reset token
userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Export the schema
module.exports = mongoose.model("users", userSchema);
