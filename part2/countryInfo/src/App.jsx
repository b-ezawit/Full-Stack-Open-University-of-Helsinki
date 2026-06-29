import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryDetail from './components/CountryDetail'

const App = () => {
  const [query, setQuery] = useState('')
  const [allCountries, setAllCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setAllCountries(response.data)
      })
      .catch(error => console.log('Error fetching data:', error))
  }, [])

  const handleInputChange = (event) => {
    setQuery(event.target.value)
  }

  const countriesToShow = query === ''
    ? []
    : allCountries.filter(country => 
        country.name.common.toLowerCase().includes(query.toLowerCase())
      )

  const renderContent = () => {
    if (countriesToShow.length > 10) {
      return <p>Too many matches, specify another filter</p>
    }

    if (countriesToShow.length > 1 && countriesToShow.length <= 10) {
      return (
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {countriesToShow.map(country => (
            <li key={country.cca3} style={{ marginBottom: '5px' }}>
              {country.name.common}{' '}
              <button onClick={() => setQuery(country.name.common)}>
                show
              </button>
            </li>
          ))}
        </ul>
      )
    }

    // UPDATED VIEW: Passes the single country object downstream to our isolated component
    if (countriesToShow.length === 1) {
      return <CountryDetail country={countriesToShow[0]} />
    }

    return null
  }

  return (
    <div>
      <div>
        find countries <input value={query} onChange={handleInputChange} />
      </div>
      <div>
        {renderContent()}
      </div>
    </div>
  )
}

export default App