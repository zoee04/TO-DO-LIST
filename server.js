const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define Schema and Model
const TodoSchema = new mongoose.Schema({
  text: { type: String, required: true },
});
const Todo = mongoose.model("Todo", TodoSchema);

// Routes

// Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add a new todo
app.post("/todos", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Task text is required" });

  const newTodo = new Todo({ text });
  await newTodo.save();
  res.json(newTodo);
});

// Delete a todo
app.delete("/todos/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});