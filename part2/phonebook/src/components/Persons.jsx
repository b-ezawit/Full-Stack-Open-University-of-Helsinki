const NameandNum = ({ name, number, handleDelete }) => {
  return (
    <div>
      <span>{name} {number}</span>
      <button onClick={handleDelete}>delete</button>
    </div>
  )
}

const Persons = ({ personToShow, handleDelete }) => {
  return (
    <div>
      {personToShow.map(person => (
        <NameandNum
          key={person.id}
          name={person.name}
          number={person.number}
          handleDelete={() => handleDelete(person.id)}
        />
      ))}
    </div>
  )
}

export default Persons