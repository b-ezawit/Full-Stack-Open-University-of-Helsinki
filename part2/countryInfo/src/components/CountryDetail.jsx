import { useState, useEffect } from 'react'
import axios from 'axios'

const CountryDetail = ({ country }) => {
  const [weather, setWeather] = useState(null)
  
  const capital = country.capital ? country.capital[0] : null
  const languages = Object.values(country.languages || {})
  
  const api_key = import.meta.env.VITE_SOME_KEY

  useEffect(() => {
    if (!capital) return

    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&units=metric&appid=${api_key}`)
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.log('Error fetching weather data:', error)
      })
  }, [capital, api_key])

  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>capital {capital || 'N/A'}</div>
      <div>area {country.area}</div>
      
      <h3>languages:</h3>
      <ul>
        {languages.map((lang, index) => <li key={index}>{lang}</li>)}
      </ul>
      
      <img 
        src={country.flags.png} 
        alt={`Flag of ${country.name.common}`} 
        style={{ width: '150px', marginTop: '10px' }} 
      />

      {weather && (
        <div style={{ marginTop: '20px' }}>
          <h2>Weather in {capital}</h2>
          <div>temperature {weather.main.temp} Celsius</div>
          
          <img 
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} 
            alt={weather.weather[0].description} 
          />
          
          <div>wind {weather.wind.speed} m/s</div>
        </div>
      )}
    </div>
  )
}

export default CountryDetail