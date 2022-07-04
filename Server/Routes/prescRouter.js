const express = require("express")
const router = express.Router();
const {createPres,
    getPresc,
    getUserPresc} = require("../Controllers/prescriptionControl");

router.post("/Prescribe/userId/docId", createPres);
router.get("/Prescribe/userId", getUserPresc);
router.get("/Prescribe", getPresc)

module.exports = router;