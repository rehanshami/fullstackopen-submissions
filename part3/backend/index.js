require("dotenv").config();
const express = require("express");
const Note = require("./models/note");

const app = express();

// const password = process.argv[2];
// const url = `mongodb+srv://rehan:${password}@cluster0.1tfts.mongodb.net/noteApp?appName=Cluster0`;

// mongoose.set("strictQuery", false);
// mongoose.connect(url, { family: 4 });

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path: ", request.path);
  console.log("Body: ", request.body);
  console.log("---");
  next();
};

app.use(express.static("dist"));
// Access data, json-parser
app.use(express.json());
app.use(requestLogger);

// const noteSchema = new mongoose.Schema({
//   content: String,
//   important: Boolean,
// });

// noteSchema.set("toJSON", {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString();
//     delete returnedObject._id;
//     delete returnedObject.__v;
//   },
// });

// const Note = mongoose.model("Note", noteSchema);

let notes = [
  {
    id: "1",
    content: "HTML is easy",
    important: true,
  },
  {
    id: "2",
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: "3",
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  const id = request.params.id;
  Note.findById(id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
  // const note = notes.find((note) => note.id === id);
  // if (note) {
  //   response.json(note);
  // } else {
  //   response.statusMessage = "Note not found";
  //   response.status(404).end();
  // }
});

app.delete("/api/notes/:id", (request, response, next) => {
  const id = request.params.id;
  Note.findByIdAndDelete(id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
  // notes = notes.filter((notes) => notes.id !== id);
  // response.status(204).end();
});

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((n) => Number(n.id))) : 0;

  return String(maxId + 1);
};

app.post("/api/notes", (request, response, next) => {
  const body = request.body;

  // Return is very crucial here, as otherwise application continues to end and note saves
  if (!body.content) {
    return response.status(400).json({
      error: "content missing",
    });
  }

  const note = new Note({
    content: body.content,
    impotant: body.important || false,
    // id: generateId(),
  });

  // notes = notes.concat(note);
  note
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
  // response.json(note);
});

app.put("/api/notes/:id", (request, response, next) => {
  const { content, important } = request.body;

  Note.findById(request.params.id)
    .then((note) => {
      if (!note) {
        return response.status(404).end();
      }

      note.content = content;
      note.important = important;

      return note.save().then((updatedNote) => {
        response.json(updatedNote);
      });
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
