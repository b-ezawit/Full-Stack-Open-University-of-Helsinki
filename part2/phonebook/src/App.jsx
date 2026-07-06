import { useState, useEffect } from 'react'
import axios from 'axios'
import phoneService from './services/phone'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notifications'

const App = () => {

  const [persons, setPersons] = useState([])

  useEffect(() => {
    phoneService
      .getAll()
      .then((initialData) => {
        setPersons(initialData)
      })
      .catch((err) => {
        setIsError(true)
        setMessage('Error occured on HTTP GET request, getAll method')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        console.log(err)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState(null)
  const [isError, setIsError] = useState(false)

  const addNameAndNumber = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name === newName
    )

    //if the person exists
    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added in phonebook, replace the old number with a new one? `
      )

      if (!confirmUpdate) {
        return
      }

      const updatedPerson = { ...existingPerson, number: newNumber }

      phoneService
        .update(existingPerson.id, updatedPerson)
        .then((returnedData) => {
          setIsError(false)
          setMessage(`Updated ${returnedData.name}'s number`)
          setTimeout(() => setMessage(null), 5000)

          setPersons(
            persons.map(person =>
              person.id === existingPerson.id ? returnedData : person
            )
          )

          setNewName("")
          setNewNumber("")
        })
        .catch(err => {
          setIsError(true)
          setMessage(
            `Information of ${existingPerson.name} has already been removed from the server`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)

          setPersons(
            persons.filter(person => person.id !== existingPerson.id)
          )

          console.log(err)
        })

      return
    }

    //if the person does not exist
    else {
      const newPerson = {
        name: newName,
        important: Math.random() > 0.5,
        id: persons.length + 1,
        number: newNumber
      }

      phoneService
        .create(newPerson)
        .then((returnedData) => {
          setIsError(false)
          setMessage(`Added: ${returnedData.name}`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)

          setPersons(persons.concat(returnedData))

          setNewName("")
          setNewNumber("")
        })
        .catch((err) => {
          setIsError(true)
          setMessage(err.response.data.error)
          setTimeout(() => {
            setMessage(null)
          }, 5000)

          console.log(err.response.data.error)
        })
    }
  }

  const handleChangeForName = (event) => {
    setNewName(event.target.value)
  }

  const handleChangeForNumber = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Delete this person?")

    if (!confirmDelete) {
      return
    }

    phoneService
      .del(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch((err) => {
        setIsError(true)
        setMessage('Error occured on HTTP DELETE request, del method')
        setTimeout(() => {
          setMessage(null)
        }, 5000)
        console.log(err)
      })
  }

  const personToShow = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={message} isError={isError} />

      <Filter
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <h2>Add a new</h2>

      <PersonForm
        onSubmit={addNameAndNumber}
        nameValue={newName}
        onNameChange={handleChangeForName}
        numberValue={newNumber}
        onNumberChange={handleChangeForNumber}
      />

      <h2>Numbers</h2>

      <Persons
        personToShow={personToShow}
        handleDelete={handleDelete}
      />
    </div>
  )
}

export default App