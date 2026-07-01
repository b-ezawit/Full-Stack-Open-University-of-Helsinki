const express = require('express')
const app = express()
const morgan = require('morgan') //logging middleware
const cors = require('cors')


app.use(cors()) //allows requests from all origins to the server

//json parser middleware
app.use(express.json())
morgan.token('body',(request,response)=>{
    if(request.method === 'POST'){
        return JSON.stringify(request.body)
    }
    return ''
})
//manually paste the tiny format(the order of the tokens) and then append :body toked
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122"
  }
]

//get on root
app.get('/', (request,response)=>{
    response.send('<h1>You are in the root route, please specify an endpoint like (/api/persons) to retireve list of infos about collection of persons</h1>')
})


//get collection persons 
app.get('/api/persons', (request,response)=>{
    response.json(persons)
})



//get info about the number of persons and also the time of the request
app.get('/info',(request,response)=>{
    const entriesCount = persons.length
    const currentTime = new Date().toString()
    response.send(`
        <p>Phonebook has info for ${entriesCount} people</p>
        <p>${currentTime}</p>
        `)
})


//get specific individual resource/person
app.get('/api/persons/:id', (request,response)=>{
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    if (!person){
        return response.status(404).end()
    }
    response.json(person)
})


//delete a person
app.delete('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    const person = persons.find(p => p.id === id)
    
    if(person){
        persons = persons.filter(p=> p.id !== id)
    }
    response.status(204).end()
})


//post or create a person
const getId = () => {
  let randomId
  let idExists = true

  while (idExists) {
    randomId = String(Math.floor(Math.random() * 1000000))
    idExists = persons.some(person => person.id === randomId)
  }

  return randomId
}

app.post('/api/persons',(request,response)=>{
    const body = request.body
        
    if(!body.name || !body.number){
        return response.status(400).json({
            error: "name or number missing"
        })
    }
    const nameExists = persons.some(person => person.name.toLowerCase() === body.name.toLowerCase())
    if(nameExists){
        return response.status(400).json({
            error: "Name already exists, it must be unique"
        })
    }
    const person = {
        id:getId(),
        name:body.name,
        number:body.number
    }
    persons = persons.concat(person)
    response.json(person)
})




const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
