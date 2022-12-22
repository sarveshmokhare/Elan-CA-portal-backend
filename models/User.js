const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  fullname: { type: String },
  username: { type: String },
  googleName: { type: String },
  collegename: { type: String, unique: false },
  thumbnail: { type: String },
  phno: { type: Number },
  campambid: { type: Number, default: 0 },
  googleID: { type: Number },
  email: { type: String },
  task0: { type: Array, default: [0, 0] },
  task1: { type: Array, default: [0, 0] },
  task2: { type: Array, default: [0, 0] },
  task3: { type: Array, default: [0, 0] },
  task4: { type: Array, default: [0, 0] },
  task5: { type: Array, default: [0, 0] },
  task6: { type: Array, default: [0, 0] },
  task7: { type: Array, default: [0, 0] },
  task8: { type: Array, default: [0, 0] },
  task9: { type: Array, default: [0, 0] },
  rank: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
