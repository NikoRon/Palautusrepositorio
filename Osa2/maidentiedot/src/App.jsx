import { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [value, setValue] = useState('');
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (value) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          const filteredCountries = response.data.filter(country =>
            country.name.common.toLowerCase().includes(value.toLowerCase())
          );
          setCountries(filteredCountries);
        });
    } else {
      setCountries([]);
    }
  }, [value]);

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <form>
        find countries<input value={value} onChange={handleChange} />
      </form>
      {countries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {countries.length > 1 && countries.length <= 10 && (
        <div>
          {countries.map(country => (
            <div key={country.name.common}>{country.name.common}</div>
          ))}
        </div>
      )}

      {countries.length === 1 && (
        <div>
          <h2>{countries[0].name.common}</h2>
          <div>capital: {countries[0].capital}</div>
          <div>area: {countries[0].area}</div>
          <h3>languages:</h3>
          <ul>
            {Object.values(countries[0].languages).map((language, index) => (
              <li key={index}>{language}</li>
            ))}
          </ul>
          <img
            src={countries[0].flags.svg}
            width="150"
          />
        </div>
      )}
    </div>
  );
};

export default App;


