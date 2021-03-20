import React, { useState, useEffect } from "react";
import { FormControl, MenuItem, Select } from '@material-ui/core';
import './App.css';
import InfoBox from "./InfoBox/InfoBox";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setInputCountry] = useState("worldwide");

  useEffect(() => {

    fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {

        const countries = data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,

        }))
        setCountries(countries);
        console.log("countries is : ", countries);


      })



  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    console.log("country is : ", countryCode);
    setInputCountry(countryCode);
  }

  return (
    <div className="app">
      {/* Header */}
      {/* Title */}
      {/* select input dropdown field */}
      <div className="app__left">

        <div className="app__header">
          <h1>COVID-19-Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}

            >

              {/* loop through all the countries and show dropdown options list of it */}

              <MenuItem value="worldwide">Worldwide</MenuItem>

              {
                countries.map((country) =>

                  <MenuItem value={country.value}>{country.name}</MenuItem>

                )
              }
              {/* <MenuItem value="WorldWide">WorldWide</MenuItem>
            <MenuItem value="option two">option two</MenuItem>
            <MenuItem value="option 3">option 3</MenuItem>
            <MenuItem value="YOOOOO">YOOOO</MenuItem> */}



            </Select>
          </FormControl>
        </div>

        <div className="app__stats">

          <InfoBox
            title="coronaviruscases"
            cases="20"
            total="30"
            isRed

          />
          <InfoBox
            title="recoverd"
            cases="10"
            total="20"

          />
          <InfoBox
            title="deaths"
            cases="5"
            total="10"
            isRed

          />
        </div>
      </div>
      {/* InfoBoxes */}
      {/* InfoBoxes */}
      {/* InfoBoxes */}
      <div className="app__right">

        {/* Table of countries  */}
        {/* graph */}

        {/* Map */}
      </div>

    </div>
  );
}

export default App;
