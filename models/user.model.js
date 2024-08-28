const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const userSchema = mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: true,
      minLength: 3,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      validate: [isEmail],
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minLength: 6,
    },
    bio: {
      type: String,
      max: 20,
    },
    picture: {
      type: String,
      default: "./uploads/profil/random-user.png",
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    likes: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

// play function before save into display : 'back'

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
