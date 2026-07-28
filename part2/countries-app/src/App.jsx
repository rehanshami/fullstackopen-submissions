import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [countrySearch, setCountrySearch] = useState("");
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCountry, setActiveCountry] = useState(null);

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        setCountries(response.data);
        setIsLoading(false);
      });
  }, []);

  const trimmedSearch = countrySearch.trim().toLowerCase();

  const searchedCountries =
    trimmedSearch === ""
      ? []
      : countries.filter((country) =>
          country.name.common.toLowerCase().includes(trimmedSearch),
        );

  const handleChange = (e) => {
    setCountrySearch(e.target.value);
    setActiveCountry(null);
  };

  const handleActiveCountry = (country) => {
    setActiveCountry(country);
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  const countryToDisplay =
    searchedCountries.length === 1 ? searchedCountries[0] : activeCountry;

  return (
    <div>
      Find countries <input value={countrySearch} onChange={handleChange} />
      {activeCountry ? (
        <div>
          <button onClick={() => setActiveCountry(null)}>Back to list</button>
          <CountryInformation country={countryToDisplay} />
        </div>
      ) : (
        <div>
          {searchedCountries.length > 10 && (
            <p>Too many matches, specify another filter</p>
          )}
          {searchedCountries.length > 1 && searchedCountries.length <= 10 && (
            <CountryList
              countries={searchedCountries}
              handleActiveCountry={handleActiveCountry}
            />
          )}
          {searchedCountries.length === 1 && (
            <CountryInformation country={countryToDisplay} />
          )}
        </div>
      )}
    </div>
  );
}

const CountryList = ({ countries, handleActiveCountry }) => {
  return (
    <div>
      {countries.map((country) => (
        <p key={country.ccn3}>
          {country.name.common}{" "}
          <button onClick={() => handleActiveCountry(country)}>Show</button>
        </p>
      ))}
    </div>
  );
};

const CountryInformation = ({ country }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const countryName = country.name.common ?? "N/A";
  const capitalCity = country.capital[0];
  const area = country.area;
  const languages = Object.values(country.languages);
  const flag = country.flags.png;

  useEffect(() => {
    const API_KEY = import.meta.env.VITE_WEATHER_API;
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${capitalCity}&units=metric&appid=${API_KEY}`,
      )
      .then((response) => {
        setWeatherData(response.data);
        console.log(response.data);
        setIsLoading(false);
      });
  }, [capitalCity]);

  return (
    <div>
      <h2>{countryName}</h2>
      <p>Capital {capitalCity}</p>
      <p>Area {area}</p>
      <h2>Languages</h2>
      <ul>
        {languages.map((language) => (
          <li key={language}>{language}</li>
        ))}
      </ul>
      <img src={flag} alt="country flag" />
      <h2>Weather in {capitalCity}</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Temperature {weatherData.main.temp}</p>

          <p>Wind {weatherData.wind.speed}</p>
          <img
            src={`https://openweathermap.org/payload/api/media/file/${weatherData.weather[0].icon}.png`}
          />
        </>
      )}
    </div>
  );
};

export default App;
