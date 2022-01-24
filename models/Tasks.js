const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
  taskname: { type: String },
  taskdescription: { type: String },
  taskpoints: { type: Number },
});
const Task = mongoose.model("task", TaskSchema);
module.exports = Task;
