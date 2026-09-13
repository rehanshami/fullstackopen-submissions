const config = require("./utills/config")
const express = require("express")
const mongoose = require("mongoose")

const app = express()

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)

const mongoUrl = config.MONGODB_URI;
mongoose.connect(mongoUrl, {family: 4})

app.use(express.json())

app.get("/api/blogs", (request, response) => {
    Blog.find({}).then((blogs) => {
        response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
    const {title, author, url, likes} = request.body;

    const blog = new Blog({
        title,
        author,
        url,
        likes
    })

    blog.save().then((result) => {
        response.status(201).json(result)
    })
})

const PORT = config.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})