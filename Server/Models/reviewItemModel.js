const mongoose = require("mongoose")
const Schema = mongoose.Schema

const reviewSchema = new Schema({
    review: {type: String, required: [true,"Please enter a message"]},
    rater: {type: mongoose.SchemaTypes.ObjectId, ref:"users"},
    doctor: {type: mongoose.SchemaTypes.ObjectId, ref: "doctors"},
    item: {type: mongoose.SchemaTypes.ObjectId, ref: "stores"},
    vendor: {type: mongoose.SchemaTypes.ObjectId, ref: "vendors"},
    rating: {type: Number}
}, {timestamp: true})


const reviewModel = mongoose.model("Store", reviewSchema)
module.exports = reviewModel