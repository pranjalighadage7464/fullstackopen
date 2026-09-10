const Persons = ({ persons, deletePerson, changeNumber }) => {
  return (
    <div>
      {persons.map(person => (
        <p key={person.id}>
          {person.name} {person.number}
          <button onClick={() => deletePerson(person.id)}>delete</button>
          <button onClick={() => changeNumber(person)}>change</button>
        </p>
      ))}
    </div>
  )
}

export default Persons