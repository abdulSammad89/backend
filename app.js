const express = require('express');
require('dotenv').config()
const mongoose = require('mongoose');
const App = express()
App.use(express.json())
const authRoute = require("./routes/authRoute")
App.use("/auth" , authRoute)
App.get("/", (req, res) => {
    res.send("Server Started");
});
mongoose.connect(process.env.MONGOS_URL)
    .then(res => {
        App.listen(process.env.PORT, () => {
            console.log(`Database is Connected and Server Start http://localhost:${process.env.PORT}`)
        })
    })
    .catch(err => {
        console.log(err)
    })
