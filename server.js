//////////////////////////
//DEPENCENCIES
/////////////////////////
//get .env variables
require("dotenv").config()
//pull PORT from the .env, defaulting the value to 3000
const {PORT = 3000, MONGODB_URL} = process.env
//import express
const express = require("express")
//our express app object
const app = express()
//import mongoose
const mongoose = require("mongoose")
//import middleware
const cors = require("cors")
const morgan = require("morgan")

//////////////////////////
//DATABASE
/////////////////////////
//establish connection
mongoose.connect(MONGODB_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})

//connection events
mongoose.connection
.on("open", () => console.log("you are connected to Mongo"))
.on("close", () => console.log("you are disconnected from Mongo"))
.on("error", (error) => console.log(error))

///////////////////////////
//MODELS
///////////////////////////
const PeopleSchema = new mongoose.Schema({
    name: String,
    image: String,
    title: String
})

const People = mongoose.model("People", PeopleSchema)

//////////////////////////
//MIDDLEWARE
/////////////////////////
app.use(cors())
app.use(morgan("dev"))
app.use(express.json())

//////////////////////////
//ROUTES
//////////////////////////
//create a test route
app.get("/", (req,res) => {
    res.send("hello world!")
})

//PEOPLE INDEX ROUTE - DISPLAYS ALL PEOPLE
app.get("/people", async (req,res) => {
    try {
        res.json( await People.find({}))
    } catch (error) {
        res.status(400).json(error)
    }
})
//PEOPLE CREATE ROUTE
app.post("/people", async (req,res) => {
    try {
        res.json(await People.create(req.body))
    } catch (error) {
        res.status(400).json(error)
    }
})

//PEOPLE UPDATE ROUTE
app.put("/people/:id", async (req,res) => {
    try {
        res.json(await People.findByIdAndUpdate(req.params.id, req.body, {new: true}))
    } catch (error) {
        res.status(400).json(error)
    }
})

//PEOPLE DELETE ROUTE
 app.delete("/people/:id", async (req,res) => {
     try {
         res.json(await People.findByIdAndRemove(req.params.id))
     } catch (error) {
         res.status(400).json(error)
     }
 })

/////////////////////////////
//LISTENER
/////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`))