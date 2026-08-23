require('dotenv').config()

const express = require('express')
const Person = require('./models/phonebook')

const morgan = require('morgan')
const app = express()

morgan.token('body', function getBody(req) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})

app.use(express.json())
app.use(express.static('dist'))

// app.use(morgan("tiny"));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body'),
)

app.get('/api/persons', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }
      response.json(person)
    })
    .catch((error) => next(error))

  // const person = persons.find((person) => person.id === id);
  // if (!person) {
  //   response.status(404).end();
  // } else {
  //   response.json(person);
  // }
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => response.status(204).end())
    .catch((error) => next(error))
  // persons = persons.filter((person) => person.id !== id);
  // response.status(204).end();
})

app.post('/api/persons', (request, response, next) => {
  const { name } = request.body
  // if (!name) {
  //   return response.status(400).json({
  //     error: "name is required",
  //   });
  // }

  // if (!number) {
  //   return response.status(400).json({
  //     error: "number is required",
  //   });
  // }

  // //"tell me if one exists"
  // const personExists = persons.some((person) => person.name === name);

  // if (personExists) {
  //   return response.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  const person = new Person({
    name: name,
    number: request.body.number,
  })

  person
    .save()
    .then((savedPerson) => {
      response.json(savedPerson)
    })
    .catch((error) => next(error))

  // persons = persons.concat(person);
  // response.json(person);
})

app.put('/api/persons/:id', (request, response, next) => {
  const { number } = request.body

  Person.findById(request.params.id)
    .then((person) => {
      if (!person) {
        return response.status(404).end()
      }

      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch((error) => next(error))
})

app.get('/info', (request, response, next) => {
  const date = new Date()

  Person.find({})
    .then((persons) => {
      response.send(
        `<p>Phonebook has entries for ${persons.length} people</p><p>${date}</p>`,
      )
    })
    .catch((error) => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`)
})
