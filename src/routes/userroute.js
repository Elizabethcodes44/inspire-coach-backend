const express = require("express");
const UserController = require("../controllers/usercontroller");

const router = express.Router();

router.get("/", UserController.getAllUsers);
router.get("/:id", UserController.getUserById);
router.post("/coachsignup", UserController.createCoach);
router.post("/userlogin", UserController.loginCoach)
router.post("/traineesignup", UserController.createTrainee)


module.exports = router;
