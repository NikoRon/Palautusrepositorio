import { useState , useEffect} from 'react';
import axios from 'axios';
//Haetaan components-kansiosta tehdyt osiot
import Filtteri from './components/Filtteri';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
//tämä appi sisältää paljon itselle tehtyjä selvennyksiä koska vaikea tehtävä.


//pohjustukset ja annettua testidataa
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');

  const hook = () => {
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }

  useEffect(hook,[])


  //estetään uudelleen latautuminen ja varmistetaan haun kirjainten toiminta
  const addName = (event) => {
    event.preventDefault();
    if (persons.some(person => person.name.toLowerCase() === newName.toLowerCase())) {
      alert(`${newName} is already added in the phonebook`);
      return;
    }
    //Tässä laitetaan kysytyt tiedot yhden objektin "nameObject" sisälle, joka concatetaan 
    //persons-listan jatkoksi, sekä nollataan nimi- ja numerokentät uutta varten.
    const nameObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    };

    setPersons(persons.concat(nameObject));
    setNewName('');
    setNewNumber('');
  };


  //tapahtuman käsittelijät jokaiselle muuttujatyypille
  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };
  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  };
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };


  //Filtteröidään listalla näytettävät henkilöt. tämä välitetään myös persons-komponentille.
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );
  //Personformin propsit on lueteltuna alle. Riittää että ne on lueteltuna
  return (
    <div>
      <h2>Phonebook</h2>
      <Filtteri filter={filter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm
        addName={addName}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={personsToShow} />
    </div>
  );
};

export default App;
