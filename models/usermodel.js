const { sql } = require("../config/db");

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
            const result = await sql.query(`SELECT * FROM Users WHERE id = ${id}`);
            return result.recordset[0];
        } catch (error) {
            throw new Error(error.message);
        }
    },

    createUser: async (name, email, password) => {
        try {
            await sql.query(
                `INSERT INTO Users (name, email, password) VALUES ('${name}', '${email}', '${password}')`
            );
            return { message: "User created successfully" };
        } catch (error) {
            throw new Error(error.message);
        }
    }
};

module.exports = UserModel;
