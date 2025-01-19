const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const bodyParser = require("body-parser");
const cors = require("cors");
const serviceAccount = require("C:\\Users\\mamil\\OneDrive\\Desktop\\fsd_day1\\day1project\\key1.json"); // Path to your Firestore service account key
//C:\Users\mamil\OneDrive\Desktop\fsd_day1\day1project\key1.json
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
const todosCollection = db.collection("todos"); // Firestore collection for todos
const app = express();
app.use(bodyParser.json()); // Middleware for parsing JSON bodies
app.use(cors()); // Enable CORS to allow cross-origin requests

const PORT = 3000;

// Create a new TODO
app.post("/todos", (req, res) => {
  const { title, description } = req.body; // Fixed syntax error here
  const newTodo = { title, description, createdAt: new Date() }; // Fixed variable declaration

  todosCollection
    .add(newTodo)
    .then((docRef) => { // Fixed variable name here
      res.status(201).json({ id: docRef.id, ...newTodo });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Get all todos
app.get("/todos", (req, res) => {
  todosCollection
    .get()
    .then((snapshot) => {
      const todos = [];
      snapshot.forEach((doc) => {
        todos.push({ id: doc.id, ...doc.data() });
      });
      res.status(200).json(todos);
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Update a TODO by ID
app.put("/todos/:id", (req, res) => {
  const { id } = req.params; // Fixed syntax error here
  const { title, description } = req.body; // Fixed syntax error here

  const updatedTodo = { title, description, updatedAt: new Date() };

  todosCollection
    .doc(id)
    .update(updatedTodo)
    .then(() => {
      res.status(200).json({ id, ...updatedTodo });
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Delete a TODO by ID
app.delete("/todos/:id", (req, res) => { // Fixed route path and syntax error
  const { id } = req.params;

  todosCollection
    .doc(id)
    .delete()
    .then(() => {
      res.status(200).json({ message: "Todo deleted successfully" }); // Fixed message syntax
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
