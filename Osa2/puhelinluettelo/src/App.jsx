import { useState , useEffect} from 'react';
import axios from 'axios';
//Haetaan components-kansiosta tehdyt osiot
import Filtteri from './components/Filtteri';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
//uusi moduuli
import nameService from './services/names.js'
//tämä appi sisältää paljon itselle tehtyjä selvennyksiä koska vaikea tehtävä.


//pohjustukset, testidata siirretty omaan moduuliin.
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');


//Haetaan data käyttämällä effectiä ja nameServiceä
  useEffect(() => {
    nameService
      .getAll()
      .then(persons => {
        setPersons(persons);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  //estetään uudelleen latautuminen ja varmistetaan haun kirjainten toiminta
  const addName = (event) => {
    event.preventDefault();
  
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());
    
    if (existingPerson) {
      // Jos henkilö löytyy, kysytään varmistus numeron päivittämisestä
      if (window.confirm(`Person ${newName} is already added to phonebook, replace the old number with new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
  
        // Lähetetään PUT-pyyntö päivittääksemme henkilön tiedot
        nameService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
            ));
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            console.error('Error updating person:', error);
            alert('Failed to update the person\'s number.');
          });
      }
      return;  // Jos henkilö on jo listalla ja numero päivitetään, ei jatketa lisäämistä
    }
  
    // Jos henkilö ei ole listalla, lisätään uusi
    const nameObject = {
      name: newName,
      number: newNumber,
    };
  
    nameService
      .create(nameObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson));
        setNewName('');
        setNewNumber('');
      })
      .catch(error => {
        console.error('Error adding person:', error);
        alert('Failed to add the person.');
      });
  };
  

  //henkilön poisto
  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      nameService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id));
        })
        .catch(error => {
          console.error(`Error deleting person with id ${id}:`, error);
          alert(`Person '${name}' was already removed from server.`);
          setPersons(persons.filter(person => person.id !== id)); // Päivitä lista
        });
    }
  };
  //tapahtuman käsittelijät jokaiselle muuttujatyypille
  function handleNameChange(event) {
    setNewName(event.target.value);
  }
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
      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  );
};

export default App;
