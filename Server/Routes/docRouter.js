const express = require("express")
const router = express.Router()
const { createDoc, upload, getDocs, login} = require("../Controllers/docController")

router.post("/register", upload, createDoc);
router.post("/Login", login);
router.get("/docs", getDocs)

module.exports = router