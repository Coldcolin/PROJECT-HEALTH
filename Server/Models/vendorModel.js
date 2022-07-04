const mongoose = require("mongoose");
// const bcrypt = require('bcrypt');
const { isEmail } = require('validator')
const Schema = mongoose.Schema;

const vendorSchema = new Schema({
    name: {type: String, required: [true,"Please enter a name"], unique: true, minlength:[2, "Please Add your name"]},
    email: {type: String, required:[true,"Please enter an email"], unique: true,  lowercase: true, validate:[isEmail, "Please use a valid Email"]},
    password: {type: String, minlength:[6, "Minimum characters is 6"]},
    Avatar: {type: String},
    Address: {type: String},
    Location: {type: String, required: true},
    Contact: {type: String},
    Specialty: {type: String},
    Items: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "items"
    }],
    Ratings: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Ratings"
    },
    isVerify: {
        type: Boolean,
    },

    OTP: {
        type: String,
    },

    mainOTP: {
        type: String,
    },

    verifiedToken: {
        type: String,
    },
}, {timestamps: true});

// vendorSchema.path("email").validate(async (email)=>{
//     const emailCount = await mongoose.models.vendor.countDocuments({ email })
//     return !emailCount
// }, "Email already exists");

// vendorSchema.path("name").validate(async (name)=>{
//     const nameCount = await mongoose.models.vendor.countDocuments({ name })
//     return !nameCount
// }, "Name already exists")

// vendorSchema.pre('save', async function(next){
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt)
//     next()
// });

const vendorModel = mongoose.model('vendor', vendorSchema)

module.exports = vendorModel