const { generatePrime } = require("crypto");
const express = require("express");
const morgan = require("morgan");
const app = express();
const cors = require("cors");

app.use(express.json());
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122",
  },
];

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :type")
);
app.use(cors());

morgan.token("type", (req, res) => JSON.stringify(req.body));

/* app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  })
);
 */
morgan.token("param", function (req, res, param) {
  return req.params[param];
});

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.send(person.number);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  console.log("request.body: ", request.body);
  console.log("persons: ", persons);
  console.log("persons -> body.name: ", body.name);
  console.log("Object.values: ", Object.values(persons));
  console.log("match: " + Object.values(persons[0]).includes("Arto Hellas"));

  if (persons.some((e) => e.name === request.body.name)) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }
  /* if (persons.some((e) => e.number === request.body.number)) {
    return response.status(400).json({
      error: "number must be unique",
    });
  } */
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
  /*  if (Object.values(persons).includes(body.name)) {
    console.log("persons -> body.name: ", body.name);

    return response.status(400).json({
      error: "name must be unique",
    });
  } */

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});
app.get("/info", (req, res) => {
  today = new Date();
  var str = today.toUTCString();
  res.send(`Phonebook has info for ${persons.length} </br> ${str}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
