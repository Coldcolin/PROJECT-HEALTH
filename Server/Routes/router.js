const express = require("express")
const router = express.Router()
const { createUser, upload, login, getUsers, verifyUser, forgotPassword,newPassword } = require("../Controllers/Controller")

router.post("/register", upload, createUser)
router.post("/login", login)
router.get("/allUsers", getUsers)
router.post("/:id/:token", verifyUser);
router.post("/forgotPassword", forgotPassword);
router.post("/reset/:id/:token", newPassword);

module.exports = router