const { sql } = require("../config/db");
const bcrypt = require("bcrypt");

const UserModel = {
getAllUsers: async () => {
try {
const result = await sql.query("SELECT * FROM Users");
return result.recordset;
} catch (error) {
throw new Error(error.message);
}
},

getUserById: async (id) => {
try {
const result = await sql.query(`SELECT * FROM Users WHERE id = @id`, {
id
});
return result.recordset[0];
} catch (error) {
throw new Error(error.message);
}
},

createUser: async (FirstName, LastName, Email, Password, Role = "trainee") => {
try {
// Validate role (only allow "coach" or "trainee")
if (!["coach", "trainee"].includes(Role.toLowerCase())) {
throw new Error("Invalid role. Allowed values are 'coach' or 'trainee'.");
}

// Hash the password before storing it
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(Password, salt);

// SQL query to insert user
const query = `
INSERT INTO Users (FirstName, LastName, Email, PasswordHash, Role)
VALUES (@FirstName, @LastName, @Email, @PasswordHash, @Role)
`;

await new sql.Request()
.input("FirstName", sql.VarChar, FirstName)
.input("LastName", sql.VarChar, LastName)
.input("Email", sql.VarChar, Email)
.input("PasswordHash", sql.VarChar, hashedPassword)
.input("Role", sql.VarChar, Role.toLowerCase()) // Ensure lowercase consistency
.query(query);

return { message: "User created successfully" };
} catch (error) {
throw new Error(error.message);
}
}
};

module.exports = UserModel;
