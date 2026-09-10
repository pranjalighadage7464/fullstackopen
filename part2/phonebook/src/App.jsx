import { useState, useEffect } from 'react'
import phonebook from './services/phonebook'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Countries from './components/Countries'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    phonebook
      .getAll()
      .then(response => {
        setPersons(response)
      })
  }, [])

  const showNotification = (message, type) => {
    setNotification({ message, type })

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }

      if (window.confirm(`${newName} is already added. Replace the old number with the new one?`)) {
        phonebook
          .update(existingPerson.id, updatedPerson)
          .then(response => {
            setPersons(
              persons.map(person =>
                person.id === existingPerson.id ? response : person
              )
            )

            setNewName('')
            setNewNumber('')
            showNotification(`${newName}'s number was changed`, 'success')
          })
          .catch(error => {
            console.log(error)
            showNotification(
              `Information of ${newName} has already been removed from the server`,
              'error'
            )
          })
      }

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    phonebook
      .create(personObject)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
        showNotification(`${newName} added to phonebook`, 'success')
      })
  }

  const changeNumber = (person) => {
    const newNumber = window.prompt(
      `Enter new number for ${person.name}:`
    )

    if (newNumber === null) {
      return
    }

    const updatedPerson = {
      ...person,
      number: newNumber
    }

    phonebook
      .update(person.id, updatedPerson)
      .then(response => {
        setPersons(
          persons.map(person =>
            person.id === response.id ? response : person
          )
        )

        showNotification(
          `${person.name}'s number was changed`,
          'success'
        )
      })
      .catch(error => {
        console.log(error)

        showNotification(
          `Information of ${person.name} has already been removed from the server`,
          'error'
        )
      })
  }

  const deletePerson = (id) => {
    if (window.confirm('Delete this person?')) {
      phonebook
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          console.log(error)
          showNotification(
            'Information of this person has already been removed from the server',
            'error'
          )
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <Countries />

      <h2>Phonebook</h2>

      {notification && (
        <div
          style={{
            color: notification.type === 'success' ? 'green' : 'red',
            background:
              notification.type === 'success' ? '#d4edda' : '#f8d7da',
            border:
              notification.type === 'success'
                ? '1px solid green'
                : '1px solid red',
            padding: '10px',
            marginBottom: '10px'
          }}
        >
          {notification.message}
        </div>
      )}

      <Filter
        filter={filter}
        handleFilterChange={handleFilterChange}
      />

      <h3>Add a new</h3>

      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>

      <Persons
        persons={personsToShow}
        deletePerson={deletePerson}
        changeNumber={changeNumber}
      />
    </div>
  )
}

export default App