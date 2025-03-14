const express = require("express");
const UserController = require("../controllers/usercontroller");

const router = express.Router();

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/", UserController.createUser);

module.exports = router;
