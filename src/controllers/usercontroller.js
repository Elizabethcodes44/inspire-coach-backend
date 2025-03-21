const UserModel = require("../../models/usermodel");
const { dotenv } = require("dotenv");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require("../../config/db");


const bcrypt = require("bcryptjs");

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
            const { FirstName, LastName, Email, Password } = req.body;
    
            if (!FirstName || !LastName || !Email || !Password) {
                return res.status(400).json({ error: "All fields are required" });
            }
    
            const newCoach = await UserModel.createCoach(FirstName, LastName, Email, Password);
            res.status(201).json(newCoach);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    createTrainee: async (req, res) => {
        try {
            const { FirstName, LastName, Email, Password } = req.body;
            const token = req.header("Authorization");

            if (!token) {
                return res.status(401).json({ error: "Access denied. No token provided." });
            }

            // Verify token and extract user ID
            const secret = process.env.SECRET;
            let userId;
            try {
                const verified = jwt.verify(token.replace("Bearer ", ""), secret);
                console.log("Verified Token Payload:", verified);
                userId = verified.sub;
            } catch (error) {
                return res.status(403).json({ error: "Invalid token" });
            }
            


            // Check if the user is a coach
            const pool = await poolPromise;
            const roleCheck = await pool
                .request()
                .input("userId", sql.Int, userId)
                .query("SELECT Role FROM Users WHERE UserID = @userId");

            if (!roleCheck.recordset[0] || roleCheck.recordset[0].Role !== "coach") {
                return res.status(403).json({ error: "Access denied. Only coaches can perform this action." });
            }

            // Call the model function to create a trainee
            const newTrainee = await UserModel.createTrainee(FirstName, LastName, Email, Password);
            res.status(201).json(newTrainee);
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
            const payload = { sub: foundCoach.UserID, role: foundCoach.Role, email: foundCoach.Email };
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

    

};

module.exports = UserController;
