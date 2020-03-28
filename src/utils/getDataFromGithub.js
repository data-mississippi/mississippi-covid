const request = require('request');
const csvToJSON = require('csvtojson')
const csvFilterSort = require('csv-filter-sort');
const createDateForQuery = require('./date');

const getDataFromGithub = (date, state, sendData) => {
  if (!date) {
    date = createDateForQuery();
  }

  const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${date}.csv`
  console.log(date)

  request.get(url, (error, { body } = {}) => {
    if (error) {
      sendData('Unable to connect to data source. Please try again.', undefined)
    } else {
      console.log(body)
      createJSON(body, state, date, sendData);
    }
  })
}

const createJSON = (csv, state, date, sendData) => {
  console.log(csv)
  let filterOptions = {
    hasHeader: true,
    columnToFilter: 'Country_Region',
    filterCriteria: 'US',
    filterType: 'EXACT'
  }

  // they changed their csv format on 03-23-2020
  let newHeaders = ['FIPS', 'County', 'State', 'Country', 'lastUpdated', 'Latitude', 'Longitude', 'Confirmed', 'Deaths', 'Recovered', 'Active', 'combinedKey']
  let oldHeaders = ['provinceState', 'countryRegion', 'lastUpdated', 'confirmed', 'deaths', 'recovered', 'latitude', 'longitude']

  let csvToJsonOptions = {
    output: 'json'
  }

  console.log('state', state)
  if (state) {
    filterOptions = {
      hasHeader: true,
      columnToFilter: 'Province_State',
      filterCriteria: state = state[0].toUpperCase() + state.substring(1),
      filterType: 'EXACT'
    }
    
    csvToJsonOptions.headers = newHeaders;
    csvToJsonOptions.ignoreColumns = /(State|Country|Latitude|Longitude|Active|combinedKey)/
  }

  if (date < '03-23-2020') {
    filterOptions = {
      hasHeader: true,
      columnToFilter: 'Country/Region',
      filterCriteria: 'US',
      filterType: 'EXACT'
    }

    csvToJsonOptions.headers = oldHeaders;
  }

  console.log(csvToJsonOptions)

  csvFilterSort.filter(csv, filterOptions, (error, filteredCSV) => {
    csvToJSON(csvToJsonOptions).fromString(filteredCSV).then((jsonObj) => {
      if (jsonObj.length === 0) {
        sendData('No results found for that state or date range. Please try again.', undefined)
      } else {
        sendData(undefined, jsonObj);
      }
      
    })
  })
}

module.exports = getDataFromGithub;