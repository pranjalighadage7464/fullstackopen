const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())
morgan.token('body', (request) => JSON.stringify(request.body))
app.use(morgan(':method :url :status :body'))

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '050-987654'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '060-111222'
  },
  {
    id: 4,
    name: 'Pranjali',
    number: '1234567890'
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Phonebook Backend</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const person = request.body

  if (!person.name || !person.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const maxId = persons.length > 0
    ? Math.max(...persons.map(person => person.id))
    : 0

  const newPerson = {
    id: maxId + 1,
    name: person.name,
    number: person.number
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

app.get('/info', (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `)
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})