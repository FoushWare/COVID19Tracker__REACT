import React, { useState, useEffect } from "react";
import { FormControl, MenuItem, Select } from '@material-ui/core';
import './App.css';
import InfoBox from "./InfoBox/InfoBox";
import { prettyPrintStat, sortData } from './Utils';
import { Card, CardContent } from "@material-ui/core";
import Table from './CasesTable/Table';
import LineGraph from './LineGraph/LineGraph';
import Map from './Map/Map';


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [casesType, setCasesType] = useState("cases");
  const [tableData, setTableData] = useState([]);

  const [mapCountries, setMapCountries] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);




  // Get the default Info if the worldWide selected 
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      })
  }, [])



  // Get all countries to populate the dropdown menu with it's value
  useEffect(() => {

    const getContriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {

          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,

          }))
          // Sorting the cases decending 
          let sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
          console.log("countries is : ", countries);
        })
    }
    getContriesData();

  }, []);

  // when the user change the country from the dropdown menu 
  //... update the menu with the selected country and
  //... change the url to fetch the info cases related to the user choice 

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    console.log("country is : ", countryCode);
    const url =
      countryCode === "worldwide" ?
        "https://disease.sh/v3/covid-19/all" :
        `https://disease.sh/v3/covid-19/countries/${countryCode}`;


    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
        setInputCountry(countryCode);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);

      })

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
            onClick={(e) => setCasesType("cases")}
            title="coronaviruscases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={countryInfo.cases}
            isRed
            active={casesType === "cases"}

          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="recoverd"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={countryInfo.todayCases}
            active={casesType === "recovered"}

          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={countryInfo.deaths}
            isRed
            active={casesType === "deaths"}

          />


          {console.log("case is ", casesType)}
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />

      </div>
      {/* InfoBoxes */}
      {/* InfoBoxes */}
      {/* InfoBoxes */}
      {/* Map */}
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>

        {/* Table of countries  */}
        {/* graph */}

      </Card>

    </div>
  );
}

export default App;
