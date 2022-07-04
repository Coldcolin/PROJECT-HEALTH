const express = require("express");
const router = express.Router();
const {createItems,getItems, getStore, upload,updateItems,deleteItems} = require("../Controllers/storeController");


router.post("/create/:id", upload, createItems);
router.get("/get/:id", getItems);
router.get("/Show", getStore);

module.exports = router