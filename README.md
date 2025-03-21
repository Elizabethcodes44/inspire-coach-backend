# Inspire Coach 

# Backend - AI-Powered Job Coaching Application

## Overview
This is the backend of the AI-powered job coaching application, built using **Node.js, Express.js, and Azure SQL Database**. The backend handles user authentication, task management, AI-powered assistance, and real-time notifications.

## Tech Stack
- **Node.js & Express.js** - Server-side framework
- **Azure SQL Database** - Cloud database for storing user and task data
- **JWT (JSON Web Token)** - Authentication
- **Azure Cognitive Services** - AI-driven features
- **Azure Notification Hub** - Push notifications

## Features
✅ User Authentication (Sign-up, Login, JWT-based authentication)
✅ AI Task Breakdown using Azure OpenAI
✅ Smart Reminders using Azure AI Personalizer
✅ Progress Reports via Azure AI Document Intelligence
✅ Accessibility Features (Speech-to-Text, Text-to-Speech, Sign Language AI)
✅ Real-time Notifications with Azure Notification Hub

## Installation

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/your-repo/backend.git
cd backend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add the following:
```
PORT=5001
SECRET=your_jwt_secret
AZURE_SQL_SERVER=your_sql_server
AZURE_SQL_DATABASE=your_database_name
AZURE_SQL_USER=your_db_user
AZURE_SQL_PASSWORD=your_db_password
AZURE_NOTIFICATION_HUB_CONNECTION=your_notification_hub_connection
```

### 4️⃣ Start the Server
```sh
npm start
```

## API Endpoints

### Users
| Method | Endpoint | Description |
|--------|-------------|----------------|
| `GET` | `/api/users` | Get all users |
| `GET` | `/api/users/:id` | Get user by ID |
| `POST` | `/api/users/coachsignup` | Coach registration |
| `POST` | `/api/users/traineesignup` | Trainee registration |
| `POST` | `/api/users/userlogin` | User login |

## Database Configuration
The application connects to **Azure SQL Database** using the **mssql** package. Database configuration is managed in `config/db.js`.

### Example DB Connection (`config/db.js`)
```js
const sql = require("mssql");
const config = {
  user: process.env.AZURE_SQL_USER,
  password: process.env.AZURE_SQL_PASSWORD,
  server: process.env.AZURE_SQL_SERVER,
  database: process.env.AZURE_SQL_DATABASE,
  options: {
    encrypt: true,
    enableArithAbort: true
  }
};
const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log("✅ Connected to Azure SQL Database");
    return pool;
  })
  .catch(err => console.error("❌ Database Connection Failed!", err));
module.exports = { sql, poolPromise };
```

## License
MIT License © 2025 Your Company

## Contributors
Elizabeth ,Kayode, Amy, Adedapo

🚀 **Happy Coding!** 🚀
