const express = require("express");
require("dotenv").config();
const cors = require("cors"); // Import the cors middleware
const userRoutes = require("./src/routes/userroute");

const { poolPromise } = require("./config/db"); // Import the database connection pool

const app = express();

app.use(cors()); // Enable CORS

// Ensure DB is connected before starting the server
poolPromise
    .then(() => {
        console.log("✅ Database connected, starting server...");
        app.listen(process.env.PORT || 3000, () => {
            console.log(`🚀 Server running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err);
        process.exit(1); // Exit the app if DB fails
    });

app.use(express.json());
// API Routes
app.use("/api/users", userRoutes);


