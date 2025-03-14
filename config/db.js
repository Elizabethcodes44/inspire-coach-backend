require('dotenv').config();
const sql = require('mssql');

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: process.env.DB_ENCRYPT === 'true',
        trustServerCertificate: process.env.DB_TRUST_SERVER_CERT === 'true'
    }
};

async function connectDB() {
    try {
        await sql.connect(config);
        console.log("✅ Connected to Azure SQL Database!");
    } catch (err) {
        console.error("❌ Database connection error:", err);
    }
}

module.exports = { connectDB, sql };
