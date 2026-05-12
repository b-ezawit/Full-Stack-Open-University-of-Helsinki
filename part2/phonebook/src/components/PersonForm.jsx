const PersonForm = ({ addPerson, nameValue, handleNameChange, numberValue, handleNumberChange }) => (
  <form onSubmit={addPerson}>
    <div>
      name: <input value={nameValue} onChange={handleNameChange} />
    </div>
    <div>
      number: <input value={numberValue} onChange={handleNumberChange} />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
)

export default PersonForm