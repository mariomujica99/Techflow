require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const reportRoutes = require("./routes/reportRoutes");
const comStationRoutes = require("./routes/comStationRoutes");
const providerRoutes = require("./routes/providerRoutes");
const whiteboardRoutes = require("./routes/whiteboardRoutes");
const supplyRoutes = require("./routes/supplyRoutes");
const fileRoutes = require("./routes/fileRoutes");

const app = express();

// Middleware to handle CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
  })
);

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/com-stations", comStationRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/lab-whiteboard", whiteboardRoutes);
app.use("/api/supplies", supplyRoutes);
app.use("/api/files", fileRoutes);

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Handle multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Maximum size is 50MB' });
    }
    return res.status(400).json({ message: err.message });
  }
  
  // Handle other errors
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error'
  });
});

// Catch-all for undefined routes (should be last)
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
