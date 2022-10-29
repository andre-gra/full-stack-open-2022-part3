require('dotenv').config()
const express = require('express')
const app = express()
var morgan = require('morgan')
const Note = require('./models/note')

app.use(express.static('build'))

// create application/json parser
app.use(express.json())

// morgan token
morgan.token('details', function (req, res) {return JSON.stringify(req.body)})

// use morgan
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :details'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!!!!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/info', (request, response) => {
  const n = notes.length
  response.send(`
    <p>Phonebook has info for ${n} people</p>
    <p>${new Date()}</p>
    `)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notes.find(note => note.id === id)
  
  if (note) {
    response.json(note)
  } else {
    response.status(404).end()
  }
})

// delete note by id
app.delete('/api/notes/:id', (request, response, next) => {
  Note.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Add new note
app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }

  const note = new Note({
    id: getRandomInt(999999999),
    name: body.name,
    number: body.number
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// error handler middleware
app.use(errorHandler)