const express = require("express")
const router = express.Router()
const { sendMessage } = require("../Controllers/messageController")

router.post("/send/:userId/:docId", sendMessage)

module.exports = router