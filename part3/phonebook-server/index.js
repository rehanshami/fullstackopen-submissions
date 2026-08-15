const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

morgan.token("body", function getBody(req) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  }
  return "";
});

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

// app.use(morgan("tiny"));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body"),
);

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;

  const person = persons.find((person) => person.id === id);
  if (!person) {
    response.status(404).end();
  } else {
    response.json(person);
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons", (request, response) => {
  const { name, number } = request.body;
  if (!name) {
    return response.status(400).json({
      error: "name is required",
    });
  }

  if (!number) {
    return response.status(400).json({
      error: "number is required",
    });
  }

  //"tell me if one exists"
  const personExists = persons.some((person) => person.name === name);

  if (personExists) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: String(Math.floor(Math.random() * 100000)),
    name: name,
    number: request.body.number,
  };

  persons = persons.concat(person);
  response.json(person);
});

app.get("/info", (request, response) => {
  const phonebookEntries = persons.length;
  const date = new Date();
  response.send(
    `<p>Phonebook has entries for ${phonebookEntries} people</p><p>${date}</p>`,
  );
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
