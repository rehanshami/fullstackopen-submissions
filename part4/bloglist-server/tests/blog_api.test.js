const {test, after, beforeEach } = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const Blog = require("../models/blog")
const supertest = require("supertest")
const app = require("../app")
const helper = require("./test_helper")
const User = require('../models/user')
const bcrypt = require('bcrypt')

const api = supertest(app)

let token
beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
    const passwordHash = await bcrypt.hash('secret', 10)
    const user = new User({username: "testBlogUser", passwordHash})
    await user.save()

    const response = await api.post('/api/login')
          .send({ username: 'testBlogUser', password: 'secret' })
          .expect(200)
          .expect('Content-Type', /application\/json/)
    token = response.body.token

})

test('blogs are returned as JSON', async () => {
    await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)  
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test("blog posts have a unique identifier named id", async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
        assert(blog.id)
        assert.strictEqual(blog._id, undefined)
    })
})

test("valid blog posts can be added", async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
        title: "Blog added from test",
        author: "Test Script",
        url: "https://www.blogs.com/test-blog",
        likes: 84
    }

    await api
    .post("/api/blogs")
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

    const blogTitles = blogsAtEnd.map((blog) => blog.title)
    assert(blogTitles.includes("Blog added from test"))
})


test("likes property within blog defaults to 0 when missing", async () => {
    const newBlog = {
        title: "Blog with default likes",
        author: "Test Script",
        url: "https://www.blogs.com/test-blog",
    }

    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
    
    // const blogs = await helper.blogsInDb()
    // const blog = blogs.find(blog => blog.title === "Blog with default likes")
    // assert.strictEqual(blog.likes, 0)
})

test("returns bad request when title missing", async () => {
    const blogWithoutTitle = {
        author: "Test Script",
        url: "https://www.blogs.com/test-blog",
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutTitle)
        .expect(400)   
})

test("returns bad request when url is missing", async () => {
    const blogWithoutUrl = {
        title: "Blog without url",
        author: "Test Script"
        }
    
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blogWithoutUrl)
        .expect(400)

})

test("a blog can be deleted", async () => {
    const blogsAtStart = await helper.blogsInDb()
    const newBlog = {
        title: "Test blog created by user",
        author: "Rehan S",
        url: "https://www.blogs.com",
    }
    const response = await api.post('/api/blogs')
             .set('Authorization', `Bearer ${token}`)
             .send(newBlog)
             .expect(201)
             .expect('Content-Type', /application\/json/)    

    await api.delete(`/api/blogs/${response.body.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
    const ids = blogsAtEnd.map((blog) => blog.id)
    assert(!ids.includes(response.body.id))
})

test("number of likes on a blog post can be updated", async () => {
    const blogsInDB = await helper.blogsInDb()
    const blogToUpdate = blogsInDB[0]
    const updatedLikes = 123

  
   await api.put(`/api/blogs/${blogToUpdate.id}`).send({likes: updatedLikes}).expect(200)

    const blogsInDbAfterUpdate = await helper.blogsInDb()
    const updatedBlog = blogsInDbAfterUpdate.find((blog) => blog.id === blogToUpdate.id)

    assert.strictEqual(updatedBlog.likes, updatedLikes)

})


after(async () => {
    mongoose.connection.close()
})