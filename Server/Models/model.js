const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const { isEmail } = require('validator')
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {type: String, required: [true,"Please enter a name"], unique: true, minlength:[2, "Please Add your name"]},
    email: {type: String, required:[true,"Please enter an email"], unique: true,  lowercase: true, validate:[isEmail, "Please enter a valid email address"]},
    password: {type: String, minlength:[6, "Minimum characters is 6"]},
    subscription: {type: Number},
    Avatar: {type: String},
    Address: {type: String},
    Contact: {type: String},
    messages: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "messages"
    }],
    Appointments: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Appointments"
    }],
    Orders: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Store"
    }],
    Ratings: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Ratings"
    }],
    prescriptions: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Prescriptions"
    }],
    isAdmin: {
        type: Boolean,
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
}, {timestamp: true})

// userSchema.path("email").validate(async (email)=>{
//     const emailCount = await mongoose.models.user.countDocuments({ email })
//     return !emailCount
// }, "Email already exists")

// userSchema.path("name").validate(async (name)=>{
//     const nameCount = await mongoose.models.user.countDocuments({ name })
//     return !nameCount
// }, "Name already exists")

userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

const userModel = mongoose.model("user", userSchema)
module.exports = userModel