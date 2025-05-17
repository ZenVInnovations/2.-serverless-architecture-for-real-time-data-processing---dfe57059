const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const SensorSchema = new mongoose.Schema({
  deviceId: String,
  temperature: Number,
  humidity: Number,
  timestamp: Date,
});

const SensorData = mongoose.model("SensorData", SensorSchema);

// Endpoint to retrieve recent data
app.get("/api/data", async (req, res) => {
  const data = await SensorData.find().sort({ timestamp: -1 }).limit(20);
  res.json(data);
});

// Socket for real-time updates
io.on("connection", (socket) => {
  console.log("Client connected");
});

// Notify connected clients (this would be triggered manually or via webhook)
app.post("/api/notify", async (req, res) => {
  const data = req.body;
  const newEntry = new SensorData(data);
  await newEntry.save();

  io.emit("new-data", data);
  res.json({ status: "Broadcasted" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
