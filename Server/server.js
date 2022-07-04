require("dotenv").config()
require('./utils/db')
const express = require("express")
const path = require("path")
const cors = require('cors')
const app = express()
const PORT = process.env.PORT || 4000;
const router = require("./Routes/router");
const store = require("./Routes/storeRouter")
const messages = require("./Routes/messageRouter")
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cors({origin: "*"}))
app.use(cookieParser());
app.use("/uploads",express.static(path.join(__dirname, "uploads")));

app.use("/api/doctor", require('./Routes/docRouter'));
app.use("/api/pharm", require('./Routes/vendorRouter'));

app.use("/api", router);

app.use("/Store", store);
app.use('/api/message', messages);
app.use('/api/Presc', require("./Routes/prescRouter"));

app.listen(PORT, ()=>{
    console.log(`Running on PORT: ${PORT}`)
})