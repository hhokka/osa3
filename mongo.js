/* const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const number = process.argv[4];
const url = `mongodb+srv://hhokka:${password}@cluster0.0uxs4.mongodb.net/noteApp?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Note", personSchema);

const person = new Person({
  name: name,
  number: number,
});

if (process.argv[3] && process.argv[4]) {
  person.save().then((result) => {
    console.log(`added ${name} number ${number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  Person.find({}).then((result) => {
    console.log("phonebook:");

    result.forEach((person) => {
      console.log(person.name + " " + person.number);
    });
    mongoose.connection.close();
  });
}
 */
