const mongoose = require("mongoose")
const config = require("./utils/config")
const blogsRouter = require("./controllers/blogs")
const express = require("express")
const usersRouter = require("./controllers/users")
const middleware = require('./utils/middleware')
const loginRouter = require("./controllers/login")

const app = express()
const mongoUrl = config.MONGODB_URI;

mongoose.connect(mongoUrl, {family: 4})

app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use("/api/blogs", blogsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app