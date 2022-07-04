const mongoose = require("mongoose")
const Schema = mongoose.Schema

const itemsSchema = new Schema({
    name: {type: String, required: [true,"Please enter a name"]},
    Category:{type: String, required:[true, "Please add a description"]},
    Type:{type: String, required:[true, "Please add a Type"]},
    NAFDAC:{type: String, required:[true, "Please add a NAFDAC"]},
    API: {type: String},
    Image: {type: String},
    Price: {type: Number,},
    Owner: {type: mongoose.SchemaTypes.ObjectId, ref:"vendors"},
    reviews: [{type: mongoose.SchemaTypes.ObjectId, ref:"reviews"}]
}, {timestamp: true})

// itemsSchema.path("name").validate(async (name)=>{
//     const nameCount = await mongoose.models.Store.countDocuments({ name })
//     return !nameCount
// }, "Name already exists")

const itemsModel = mongoose.model("item", itemsSchema)
module.exports = itemsModel