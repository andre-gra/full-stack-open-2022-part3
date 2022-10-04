const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.g8bnfzb.mongodb.net/noteApp?retryWrites=true&w=majority`

const noteSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Note = mongoose.model('Note', noteSchema)


if (process.argv.length > 3) {
  mongoose
    .connect(url)
    .then((result) => {

      const note = new Note({
        name: process.argv[3],
        number: process.argv[4]
      })

      return note.save()
    })
    .then(() => {
      console.log(`added ${process.argv[3]} ${process.argv[4]} to phonebook`)
      return mongoose.connection.close()
    })
    .catch((err) => console.log(err))
} else {
  mongoose.connect(url)
  Note.find({}).then(result => {
    console.log("phonebook:");
    result.forEach(note => {
      console.log(note.name, note.number)
    })
    mongoose.connection.close()
  })
}