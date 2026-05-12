import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ city }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => console.log('Weather fetch failed'))
  }, [city, api_key])

  if (!weather) return null

  return (
    <div>
      <h3>Weather in {city}</h3>
      <p>temperature {weather.main.temp} Celsius</p>
      <img 
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
        alt={weather.weather[0].description} 
      />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {country.capital[0]}</div>
      <div>area {country.area}</div>
      
      <h3>languages:</h3>
      <ul>
        {Object.values(country.languages).map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
      <Weather city={country.capital[0]} />
    </div>
  )
}

const App = () => {
  const [search, setSearch] = useState('')
  const [countries, setCountries] = useState([])
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    const matches = countries.filter(c => 
      c.name.common.toLowerCase().includes(search.toLowerCase())
    )
    setFilteredCountries(matches)
  }, [search, countries])

  const handleSearchChange = (event) => setSearch(event.target.value)

  return (
    <div>
      find countries <input value={search} onChange={handleSearchChange} />
      
      <div>
        {filteredCountries.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}

        {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
          filteredCountries.map(c => (
            <div key={c.cca3}>
              {c.name.common} 
              <button onClick={() => setFilteredCountries([c])}>show</button>
            </div>
          ))
        )}

        {filteredCountries.length === 1 && (
          <CountryDetail country={filteredCountries[0]} />
        )}
      </div>
    </div>
  )
}

export default App