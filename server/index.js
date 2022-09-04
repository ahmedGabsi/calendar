const express = require("express");
const app = express();
const mongoose = require("mongoose")
const dotenv = require("dotenv");
const eventRoute = require("./routes/eventRoute")


dotenv.config();
const cors = require("cors");


 
mongoose.connect("mongodb+srv://ahmed:curvanord25@socialapp.xuq4uqt.mongodb.net/?retryWrites=true&w=majority")
.then(_=> console.log("connection successful"))
.catch(err=> console.log("database connection fail"))




app.use(express.json({limit: '50mb'}));
app.use(cors()) 
app.use("/api/events", eventRoute)



app.listen(8080, _=> console.log("backend server is running on port: "+ 8080))