morgan = require("morgan");
express = require("express");
morgan = require("morgan");
cors = require("cors");

app = express();

app.use(cors());
app.use(express.json());
app.use(
  morgan((tokens, req, res) => {
    console.log(tokens.req);
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
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
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "mehdi soltane",
    number: "1234567",
  },
];

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

app.get("/api/persons", (req, res) => {
  res.json(persons);
});
app.get("/api/info", (req, res) => {
  res.send(
    `phonebook has info for ${persons.length} people <br/>${new Date()}`
  );
});
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});
app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!(body.number && body.name)) {
    res.status(400).json({ message: "content missing" });
  }

  if (persons.find((person) => person.name === body.name)) {
    res.status(400).json({ message: "name already exists" });
  }
  const id = generateID();
  const newPerson = {
    id,
    name: body.name,
    number: body.number,
  };
  persons.push(newPerson);
  res.json(newPerson);
});
app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`listening on port:${PORT}`);
});
