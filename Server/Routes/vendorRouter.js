const express = require("express")
const router = express.Router()
const { createVendor, upload, login, getVendor, verifyPharm, forgotPassword, newPassword, getSingleVendor} = require("../Controllers/vendorController")

router.post("/register", upload, createVendor)
router.post("/login", login)
router.get("/allVendors", getVendor)
router.post("/:id/:token", verifyPharm);
router.post("/forgotPassword", forgotPassword);
router.post("/reset/:id/:token", newPassword);
router.get("/get/:Id", getSingleVendor)

module.exports = router