const { generatePrime } = require("crypto");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
require("dotenv").config();
const Person = require("./models/person");
const res = require("express/lib/response");
//const { db } = require("./models/person");

app.use(express.static("build"));

app.use(express.json());

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
);

app.use(cors());

morgan.token("type", (req, res) => JSON.stringify(req.body));

morgan.token("param", function (req, res, param) {
  return req.params[param];
});

let persons = [];
app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response, next) => {
  Person.find({})
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  console.log("body", request.body);
  const body = request.body;
  Person.findByIdAndUpdate(request.params.id, {
    name: body.name,
    number: body.number,
  })
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/persons", (request, response, next) => {
  console.log("body", request.body);
  const body = request.body;

  const person = new Person({
    id: "generateId",
    name: body.name,
    number: body.number,
  });
  Person.find({})
    .then((result) => {
      if (person) {
        result.forEach((person) => {
          persons.concat(person.name, person.number);
        });
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));

  if (body.name === "" || !body.name) {
    return response.status(400).json({
      error: "name is missing",
    });
  }
  if (body.number === "" || !body.number) {
    return response.status(400).json({
      error: "number is missing",
    });
  }

  person
    .save()
    .then((savedNote) => {
      response.json(savedNote);
    })
    .catch((error) => next(error));
});

app.get("/info", (request, response, next) => {
  const today = new Date();
  const timeUTC = today.toUTCString();
  let itemsInDb = 0;
  Person.find({})
    .then((person) => {
      if (person) {
        itemsInDb = person.length;
        response.send(
          `Phonebook has info for ${itemsInDb} people </br> ${timeUTC}`
        );
      } else {
        response.status(404).end();
      }
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

// After all registered middlewares
app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
