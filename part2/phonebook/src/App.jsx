import { useState, useEffect } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification' // Import the component

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [messageType, setMessageType] = useState('success')

  useEffect(() => {
    personService.getAll().then(initialPersons => {
      setPersons(initialPersons)
    })
  }, [])

 
  const notify = (message, type = 'success') => {
    setInfoMessage(message)
    setMessageType(type)
    setTimeout(() => {
      setInfoMessage(null)
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())

    if (existingPerson) {
      if (window.confirm(`${newName} is already added, replace number?`)) {
        const changedPerson = { ...existingPerson, number: newNumber }
        
        personService
          .update(existingPerson.id, changedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
            notify(`Updated ${returnedPerson.name}'s number`)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            notify(`Information of ${existingPerson.name} has already been removed from server`, 'error')
            setPersons(persons.filter(p => p.id !== existingPerson.id))
          })
      }
      return
    }

    const personObject = { name: newName, number: newNumber }

    personService.create(personObject).then(returnedPerson => {
      setPersons(persons.concat(returnedPerson))
      notify(`Added ${returnedPerson.name}`)
      setNewName('')
      setNewNumber('')
    })
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService.remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          notify(`Deleted ${name}`)
        })
        .catch(error => {
          notify(`Information of ${name} was already removed from server`, 'error')
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage} type={messageType} />
      
      <Filter value={filter} onChange={(e) => setFilter(e.target.value)} />

      <h3>Add a new</h3>
      <PersonForm 
        addPerson={addPerson}
        nameValue={newName} handleNameChange={(e) => setNewName(e.target.value)}
        numberValue={newNumber} handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h3>Numbers</h3>
      <Persons personsToShow={filter === '' ? persons : persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()))} deletePerson={deletePerson} />
    </div>
  )
}

export default App