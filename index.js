morgan = require("morgan");
express = require("express");
morgan = require("morgan");
cors = require("cors");
require("dotenv").config();
const Person = require("./models/Person");
app = express();

app.use(cors());
app.use(express.static("dist"));
app.use(express.json());
app.use(
    morgan((tokens, req, res) => {
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

app.get("/api/persons", (req, res) => {
    Person.find({}).then((results) => {
        res.json(results);
    });
});
app.get("/api/info", (req, res) => {
    Person.countDocuments({}).then((results) => {
        res.send(`phonebook has info for ${results} people <br/>${new Date()}`);
    });
});
app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id)
        .then((result) => {
            if (result) {
                res.json(result);
            } else {
                res.status(404).json({ message: "not found" });
            }
        })
        .catch((err) => {
            next(err);
        });
});
app.post("/api/persons", (req, res, next) => {
    const body = req.body;
    if (!(body.number && body.name)) {
        res.status(400).json({ message: "content missing" });
    }
    const newPerson = new Person({
        name: body.name,
        number: body.number,
    });
    newPerson
        .save()
        .then((result) => {
            res.json(result);
        })
        .catch((error) => next(error));
});
app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then((result) => res.status(204).end())
        .catch((error) => next(error));
});
app.put("/api/persons/:id", (req, res, next) => {
    const newPerson = {
        name: req.body.name,
        number: req.body.number,
    };
    Person.findByIdAndUpdate(req.params.id, newPerson, {
        new: true,
        runValidators: true,
        context: "query",
    })
        .then((updatedPerson) => res.json(updatedPerson))
        .catch((error) => next(error));
});
function unknownEndPoint(req, res) {
    return res.status(400).json({ message: "unknown endpoint" });
}
app.use(unknownEndPoint);

function errorHandler(error, req, res, next) {
    console.log(error.message);
    if (error.name === "CastError") {
        return res.status(400).json({ message: "malformed id" });
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
    }

    next(error);
}
app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
    console.log(`listening on port:${port}`);
});
