import { useState , useEffect} from 'react';
import axios from 'axios';
//haetaan components-kansiosta tehdyt osiot
import Filtteri from './components/Filtteri';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
//uusi moduuli
import nameService from './services/names.js'
import './index.css'
import MessageNotification from './components/notification.jsx';
//tämä appi sisältää paljon itselle tehtyjä selvennyksiä koska vaikea tehtävä.


//pohjustukset, testidata siirretty omaan moduuliin. errormessagea serveri-ilmoitukseen.
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filter, setFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);


//haetaan data käyttämällä effectiä ja nameServiceä. setPersons menee persons-muuttujan stateksi,
//eli tyhjän listan tilalle ajetaan alkudata 4 henkilöä.
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

  //estetään uudelleen latautuminen (event.prevendefault) ja varmistetaan haun kirjainten toiminta
  const addName = (event) => {
    event.preventDefault();
  //katsotaan, onko lisättävä henkilö jo listalla, merkit huomioiden
    const existingPerson = persons.find(person => person.name.toLowerCase() === newName.toLowerCase());
    
    if (existingPerson) {
      // jos henkilö löytyy, kysytään varmistus numeron päivittämisestä. ...existingperson hakee muuttujan kaikki tiedot
      //ja tietokohtaan number ajetaan newnumber
      if (window.confirm(`Person ${newName} is already added to phonebook, replace the old number with new one?`)) {
        const updatedPerson = { ...existingPerson, number: newNumber };
        
        // lähetetään PUT-pyyntö päivittääksemme henkilön tiedot. nameservicellä yhteys names.js ja 3001.
        nameService
          .update(existingPerson.id, updatedPerson)
          .then(returnedPerson => {
            setPersons(persons.map(person =>
              person.id !== existingPerson.id ? person : returnedPerson
            ));
            setNewName('');
            setNewNumber('');
            setSuccessMessage(`Added a new number for ${returnedPerson.name}`)
            setTimeout(() => setSuccessMessage(null), 5000)
          })
          .catch(error => {
            console.error('Error updating person:', error);
            alert('Failed to update the person\'s number.');
          });
      }
      return;  // jos henkilö on jo listalla ja numero päivitetään, ei jatketa lisäämistä
    }
  
    // jos henkilö ei ole listalla, lisätään uusi, menee myös nameservicen avulla serverille.
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
        setSuccessMessage(`Added ${returnedPerson.name}`)
        setTimeout(() => setSuccessMessage(null), 5000)
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
          setSuccessMessage(`Deleted ${name}`)
          setTimeout(() => setErrorMessage(null), 5000)
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


  //filtteröidään listalla näytettävät henkilöt. tämä välitetään myös persons-komponentille.
  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  );
  //personformin propsit on lueteltuna alle. Riittää että ne on lueteltuna
  return (
    <div>
      <h2>Phonebook</h2>
      <MessageNotification message={errorMessage} type="error" />
      <MessageNotification message={successMessage} type="success" />
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
