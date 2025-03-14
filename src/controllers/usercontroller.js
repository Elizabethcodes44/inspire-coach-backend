const UserModel = require("../../models/usermodel");

const UserController = {
    getAllUsers: async (req, res) => {
        try {
            const users = await UserModel.getAllUsers();
            res.json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await UserModel.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            res.json(user);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    createUser: async (req, res) => {
        try {
            const { FirstName, LastName, Email, Password, Role } = req.body;

            // Ensure all required fields are provided
            if (!FirstName || !LastName || !Email || !Password) {
                return res.status(400).json({ error: "All fields are required" });
            }

            // Pass role (default to "trainee" if not provided)
            const newUser = await UserModel.createUser(FirstName, LastName, Email, Password, Role || "trainee");
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = UserController;
