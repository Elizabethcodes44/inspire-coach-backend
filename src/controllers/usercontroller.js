const UserModel = require("../../models/usermodel");
const { dotenv } = require("dotenv");
const jwt = require("jsonwebtoken");
const secret = process.env.secret;
const bcrypt = require("bcrypt");

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

    createCoach: async (req, res) => {
        try {
            const { FirstName, LastName, Email, Password, Role } = req.body;

            // Ensure all required fields are provided
            if (!FirstName || !LastName || !Email || !Password) {
                return res.status(400).json({ error: "All fields are required" });
            }

            // Pass role (default to "trainee" if not provided)
            const newUser = await UserModel.createCoach(FirstName, LastName, Email, Password, Role || "trainee");
            res.status(201).json(newUser);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    loginCoach: async (req, res) => {
        try {
            console.log("Received body:", req.body);
            
            const { Email, Password } = req.body;
    
            // Ensure all required fields are provided
            if (!Email || !Password) {
                return res.status(400).json({ error: "Email and password are required" });
            }
    
            // Call UserModel to get coach details from the database
            const foundCoach = await UserModel.getUserByEmail(Email);
            if (!foundCoach) {
                return res.status(401).json({ error: "Invalid email or password." });
            }
    
            // Compare passwords
            const passwordsMatch = await bcrypt.compare(Password, foundCoach.PasswordHash);
            if (!passwordsMatch) {
                return res.status(401).json({ error: "Invalid email or password." });
            }
    
            // Generate JWT token
            const secret = process.env.SECRET;
            const payload = { sub: foundCoach.id, role: foundCoach.Role, email: foundCoach.Email };
            const token = jwt.sign(payload, secret, { expiresIn: '1hr' });
    
            console.log("Generated Token:", token);
    
            // Send response (only one response!)
            return res.status(200).json({
                message: "Login successful",
                token,
                id: foundCoach.id,
                role: foundCoach.Role
            });
    
        } catch (error) {
            console.error("Login error:", error.message);
            return res.status(500).json({ error: "Internal Server Error" });
        }
    },

    createTrainee: async (req, res) => {
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
    },

    loginTrainee: async (req, res) => {
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
