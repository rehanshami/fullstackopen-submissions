const Blog = require("../models/blog")

const initialBlogs = [
    {
    title: "This is my first blog",
    author: "Raymond Jones",
    url: "https://www.blogs.co.nz/my-first-blog",
    likes: 24
    },
    {
    title: "Javascript is hard",
    author: "Keacy Carty",
    url: "https://www.blogs.co.nz/javascript-hard",
    likes: 124
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map((blog => blog.toJSON()))
}

module.exports = {
    initialBlogs,
    blogsInDb
}