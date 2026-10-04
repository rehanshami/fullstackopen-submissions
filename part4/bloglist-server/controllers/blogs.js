const blogsRouter = require("express").Router()
const Blog = require("../models/blog")
const { userExtractor } = require("../utils/middleware")

blogsRouter.get("/", async (request, response) => {
    const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
    const {title, author, url, likes} = request.body;

    if (!title || !url) {
        return response.status(400).json({error: "title or url is missing"})
    }

    const user = request.user

    const blog = new Blog({
        title,
        author,
        url,
        likes: likes ?? 0,
        user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    response.status(201).json(savedBlog)
})

blogsRouter.put('/:id', async (request, response) => {
    const {likes} = request.body
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).end()
    }

    blog.likes = likes;
    const updatedBlog = await blog.save()
    response.json(updatedBlog)
})


blogsRouter.delete('/:id', userExtractor, async (request, response) => {
    const user = request.user
    const blog = await Blog.findById(request.params.id)

    if (!blog) {
        return response.status(404).json({error: "blog not found"})
    }

    if (user._id.toString() === blog.user.toString()) {
    await Blog.findByIdAndDelete(blog._id)
    response.status(204).end()
    } else {
        return response.status(403).json({error: "unauthorized to perform this action"})
    }

})

module.exports = blogsRouter