const express = require("express");
const cors = require("cors"); // Import CORS
const { connectDB } = require("./config/db");
const userRoutes = require("./src/routes/userroute");

const app = express();

// Apply CORS middleware
app.use(cors()); // Enables ALL CORS requests (good for development)

app.use(express.json());

async function startServer() {
  await connectDB();
  app.use("/api/users", userRoutes);

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
