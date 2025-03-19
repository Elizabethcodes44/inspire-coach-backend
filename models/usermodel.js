const { sql, poolPromise } = require("../config/db");


const bcrypt = require("bcrypt");

const UserModel = {
  getAllUsers: async () => {
    try {
        // Ensure connection is established
        const pool = await poolPromise;

        // Run the query using the connection pool
        const result = await pool.request().query("SELECT * FROM Users");

        return result.recordset;
    } catch (error) {
        throw new Error(error.message);
    }
},

  getUserById: async (id) => {
    try {
      const result = await sql.query(`SELECT * FROM Users WHERE UserID = @id`, {
        id,
      });
      return result.recordset[0];
    } catch (error) {
      throw new Error(error.message);
    }
  },

  getUserByEmail: async (Email) => {
    try {
        const pool = await poolPromise; // Ensure connection
        const request = pool.request(); // Use pool connection
        request.input("Email", sql.VarChar, Email);

        const result = await request.query(
            "SELECT * FROM Users WHERE Email = @Email"
        );

        return result.recordset[0]; // Return the first matching user
    } catch (error) {
        console.error("Database query error:", error);
        throw new Error(error.message);
    }
},

createCoach: async (FirstName, LastName, Email, Password, Role = "coach") => {
  try {
      if (Role.toLowerCase() !== "coach") {
          throw new Error("Invalid role. Allowed value for this function is 'coach'.");
      }

      // Ensure connection is established
      const pool = await poolPromise;

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(Password, salt);

      // Run the query using the connection pool
      await pool.request()
          .input("FirstName", sql.VarChar, FirstName)
          .input("LastName", sql.VarChar, LastName)
          .input("Email", sql.VarChar, Email)
          .input("PasswordHash", sql.VarChar, hashedPassword)
          .input("Role", sql.VarChar, Role)
          .query(`
              INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Role)
              VALUES (@FirstName, @LastName, @Email, @PasswordHash, @Role)
          `);

      return { message: "Coach created successfully" };
  } catch (error) {
      throw new Error(error.message);
  }
},

   // Function to create a trainee
   createTrainee: async (FirstName, LastName, Email, Password) => {
    try {
        const pool = await poolPromise;

        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);

        // Insert new trainee into the Users table
        await pool
            .request()
            .input("FirstName", sql.VarChar, FirstName)
            .input("LastName", sql.VarChar, LastName)
            .input("Email", sql.VarChar, Email)
            .input("PasswordHash", sql.VarChar, hashedPassword)
            .input("Role", sql.VarChar, "trainee")
            .query(`
                INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Role)
                VALUES (@FirstName, @LastName, @Email, @PasswordHash, @Role)
            `);

        return { message: "Trainee created successfully" };
    } catch (error) {
        throw new Error(error.message);
    }
},
};

module.exports = UserModel;
