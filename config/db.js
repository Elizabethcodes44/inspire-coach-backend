// config/db.js
const sql = require("mssql");

const config = {
  user: "myadmin",
  password: "MyStrongPassword!",
  server: "inspirecoachserver3547.database.windows.net", // Remove 'tcp:' prefix
  database: "InspireCoachDB",
  options: {
    encrypt: true, // Required for Azure
    trustServerCertificate: false,
    connectTimeout: 30000, // 30 seconds in milliseconds
    port: 1433 // Explicit port specification (optional but recommended)
  }
};

// Create connection pool
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect(); // Initiate connection immediately

async function connectDB() {
  try {
    await poolConnect;
    console.log("Connected to Azure SQL Database");
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err; // Fail fast if connection fails
  }
}

// Export the connected pool as 'sql'
module.exports = {
  sql: pool, // This will be used in your UserModel
  connectDB
};
