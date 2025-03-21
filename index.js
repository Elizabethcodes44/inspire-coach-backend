const express = require("express");
require("dotenv").config();
const cors = require("cors"); // Import CORS middleware
const userRoutes = require("./src/routes/userroute");
const { poolPromise } = require("./config/db"); // Import the database connection pool

const app = express();

// ✅ Improved CORS Setup
const corsOptions = {
    origin: "*", // Change to frontend URL in production
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// ✅ Explicitly Handle OPTIONS Requests
app.options("*", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.status(204).end();
});

// ✅ Ensure JSON Parsing Middleware is Before Routes
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Allow form data parsing

// ✅ Ensure DB Connection Before Starting Server
poolPromise
    .then(() => {
        console.log("✅ Database connected, starting server...");
        const port = process.env.PORT || 5001;
        app.listen(port, () => {
            console.log(`🚀 Server running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err);
        process.exit(1); // Exit the app if DB fails
    });

// ✅ API Routes
app.use("/api/users", userRoutes);

// ✅ Handle Unknown Routes Gracefully
app.use((req, res, next) => {
    res.status(404).json({ error: "Route not found" });
});

// ✅ Improved Global Error Handler
app.use((err, req, res, next) => {
    console.error("❌ Server Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
