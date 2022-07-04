const mongoose = require("mongoose")
const Schema = mongoose.Schema

const prescriptionSchema = new Schema({
    prescription: {type: String, required: [true,"Please enter a message"]},
    user: {type: mongoose.SchemaTypes.ObjectId, ref:"users"},
    doctor: {type: mongoose.SchemaTypes.ObjectId, ref: "doctors"},
}, {timestamp: true})


const prescriptionModel = mongoose.model("Store", prescriptionSchema)
module.exports = prescriptionModel