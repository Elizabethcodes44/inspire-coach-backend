const express = require("express");
const { connectDB } = require("./config/db");
const userRoutes = require("./src/routes/userroute");

const app = express();
app.use(express.json());

async function startServer() {
  // Connect to Database first
  await connectDB(); // Ensure this returns a promise

  // Attach routes
  app.use("/api/users", userRoutes);

  // Start server after DB connection
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
