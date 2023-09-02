const mongoose = require("mongoose");
const prompt = require("prompt-sync")();

function printAll() {}
function save(person) {
    person.save().then((result) => {
        console.log("person saved:");
        console.log(person);
        mongoose.connection.close();
    });
}

//case no password
if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

//establishing connection
const password = process.argv[2];
const url = `mongodb+srv://mehdi:${password}@cluster0.jn4vc1m.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);
//creating model
const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
});
const Person = mongoose.model("Person", personSchema);

//case want to print
if (process.argv.length < 4) {
    Person.find().then((results) => {
        console.log("phonebook:");
        results.forEach((r) => {
            console.log(`${r.name} ${r.number}`);
        });
        mongoose.connection.close();
    });
} else {
    const name = process.argv[3];
    let number = process.argv[4];
    if (process.argv.length < 5) {
        number = prompt("enter a number: ");
    }
    new Person({ name, number }).save().then(() => {
        console.log("person saved");
        mongoose.connection.close();
    });
}
