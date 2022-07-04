const mongoose = require("mongoose")
const Schema = mongoose.Schema

const appointmentSchema = new Schema({
    message: {type: String, required: [true,"Please enter a message"]},
    user: {type: mongoose.SchemaTypes.ObjectId, ref:"users"},
    doctor: {type: mongoose.SchemaTypes.ObjectId, ref: "doctors"},
    time: {type: String, required:[true, "please add an appointment time"]},
    day: {type: String, required:[true, "please add an appointment day"]}
}, {timestamp: true})


const appointmentModel = mongoose.model("Store", appointmentSchema)
module.exports = appointmentModel