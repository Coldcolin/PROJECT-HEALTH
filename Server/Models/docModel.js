const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const { isEmail } = require('validator')
const Schema = mongoose.Schema;

const docSchema = new Schema({
    name: {type: String, required: [true,"Please enter a name"], minlength:[2, "Please Add your name"]},
    email: {type: String, required:[true,"Please enter an email"], unique: true,  lowercase: true, validate:[isEmail, "Please enter a valid email"]},
    password: {type: String, minlength:[6, "Minimum characters is 6"]},
    Avatar: {type: String},
    Address: {type: String},
    Contact: {type: String},
    Specialty: {type: String},
    License: {type: String},
    messages: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "messages"
    }],
    Appointments: [{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Appointments"
    }],
    Ratings: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Ratings"
    },
    Prescriptions:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Prescriptions"
    }],
    facilities:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: "facilities"
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
}, {timestamps: true});

// docSchema.path("email").validate(async (email)=>{
//     const emailCount = await mongoose.models.doctor.countDocuments({ email })
//     return !emailCount
// }, "Email already exists");

// docSchema.path("name").validate(async (name)=>{
//     const nameCount = await mongoose.models.doctor.countDocuments({ name })
//     return !nameCount
// }, "Name already exists")

docSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt)
    next()
});

const docModel = mongoose.model('doctor', docSchema)

module.exports = docModel