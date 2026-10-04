const {describe, test, beforeEach, after} = require("node:test")
const assert = require("node:assert")
const supertest = require("supertest")
const User = require("../models/user")
const bcrypt = require("bcrypt")
const helper = require("./user_helper")
const app = require("../app")
const { default: mongoose } = require("mongoose")

const api = supertest(app)

describe("when there is initially one user in db", () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash("secret", 10)
        const user = new User({username: "resene", name: "bubbles", passwordHash})
        await user.save()
        
    })

    test("creation succeeds with a fresh username", async () => {
        const usersInDbAtStart = await helper.usersInDb()
        const newUser = {
            username: "gense",
            password: "sumyun",
            name: "resenes"
        }
        await api.post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersInDbAtEnd = await helper.usersInDb()
        assert.strictEqual(usersInDbAtEnd.length, usersInDbAtStart.length + 1)

        const usernames = usersInDbAtEnd.map((user) => user.username)
        assert(usernames.includes('gense'))
    })

    test("creation fails with status code 400 when username is not supplied", async () => {
        const usersAtStart = await helper.usersInDb()
        const user = {
            name: "resene",
            password: "tensea"
        }

        const response = await api.post('/api/users')
                                .send(user)
                                .expect(400)
                                .expect('Content-Type', /application\/json/)
        console.log(response.body.error)
        assert(response.body.error.includes('username and password are required'))   
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)                     
    })

    test("creation fails with status code 400 when password is missing", async () => {
        const usersAtStart = await helper.usersInDb()
        const user = {
            username: "resena1",
            name: "tasha"
        }
        const response = await api.post('/api/users')
                                .send(user)
                                .expect(400)
                                .expect('Content-Type', /application\/json/)
        assert(response.body.error.includes('username and password are required'))
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)
    })

    test("creation fails with status code 400 when username is less than 3 characters", async () => {
        const usersAtStart = await helper.usersInDb()
        const user = {
            username: "ab",
            password: "gensea",
            name: "testers"
        }
        const response = await api.post('/api/users')
                                .send(user)
                                .expect(400)
                                .expect('Content-Type', /application\/json/)
        assert(response.body.error.includes('User validation failed: username: Path `username`'))
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)                        
    })

    test("user creation fails with status code 400 when password is less than 3 characters", async () => {
        const usersAtStart = await helper.usersInDb()
        const user = {username: "tony brar", password: "ab", name: "baxton"}

        const response = await api.post('/api/users')
                                .send(user)
                                .expect(400)
                                .expect('Content-Type', /application\/json/)

        assert(response.body.error.includes('password must be at least 3 characters'))
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)                        
    })
    test("user creation fails with status code 400 when username is not unique", async () => {
        const usersAtStart = await helper.usersInDb()
        const user = {username: "resene", password: "booster", name: "bubbles"}

        const response = await api.post('/api/users')
                                    .send(user)
                                    .expect(400)
                                    .expect('Content-Type', /application\/json/)
        assert(response.body.error.includes('expected `username` to be unique'))  
        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtStart.length, usersAtEnd.length)                          

    })

})
after(async () => {
    await mongoose.connection.close()
})
