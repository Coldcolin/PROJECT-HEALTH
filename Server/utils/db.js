require("dotenv").config()
const mongoose = require("mongoose")

const url = process.env.URL;
// const url = "mongodb://localhost/ProjectHealth";

// const URL = "mongodb+srv://emedi:<password>@cluster0.lhzhdyo.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
.then(()=>{
    console.log("connected to database")
}).catch((err)=>{
    console.log(err)
});

module.exports = mongoose