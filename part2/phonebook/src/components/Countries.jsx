import { useState, useEffect } from 'react'
import axios from 'axios'

const Countries = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleSearch = (event) => {
    setSearch(event.target.value)
    setSelectedCountry(null)
    setWeather(null)
  }

  const showCountry = (country) => {
    setSelectedCountry(country)
    setWeather(null)
  }

  const countriesToShow = countries.filter(country =>
    country.name.common.toLowerCase().includes(search.toLowerCase())
  )

  const country = selectedCountry || (
    countriesToShow.length === 1 ? countriesToShow[0] : null
  )

  useEffect(() => {
    if (!country || !country.capital) {
      return
    }

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&units=metric&appid=${apiKey}`
      )
      .then(response => {
        setWeather(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [country])

  return (
    <div>
      <h2>Countries</h2>

      <input
        value={search}
        onChange={handleSearch}
        placeholder="Search country"
      />

      {countriesToShow.length > 10 ? (
        <p>Too many matches, specify another filter</p>
      ) : country ? (
        <div>
          <h2>{country.name.common}</h2>

          <p>Capital: {country.capital}</p>
          <p>Area: {country.area}</p>
          <p>Population: {country.population}</p>

          <h3>Languages</h3>

          <ul>
            {Object.values(country.languages || {}).map(language => (
              <li key={language}>{language}</li>
            ))}
          </ul>

          <img
            src={country.flags.png}
            alt={`Flag of ${country.name.common}`}
            width="150"
          />

          <h3>Weather in {country.capital[0]}</h3>

          {weather && (
            <div>
              <p>Temperature: {weather.main.temp} °C</p>
              <p>Wind: {weather.wind.speed} m/s</p>

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
              />
            </div>
          )}
        </div>
      ) : (
        countriesToShow.map(country => (
          <p key={country.cca3}>
            {country.name.common}
            <button onClick={() => showCountry(country)}>
              Show
            </button>
          </p>
        ))
      )}
    </div>
  )
}

export default Countries