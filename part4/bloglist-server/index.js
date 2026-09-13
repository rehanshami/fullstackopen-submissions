const config = require("./utills/config")
const express = require("express")
const mongoose = require("mongoose")
const blogsRouter = require("./controllers/blogs")

const app = express()

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, {family: 4})

app.use(express.json())

app.use("/api/blogs", blogsRouter)

const PORT = config.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})