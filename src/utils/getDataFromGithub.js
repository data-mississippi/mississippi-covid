const request = require('request');
const csvToJSON = require('csvtojson')
const csvFilterSort = require('csv-filter-sort');

const getDataFromGithub = (date, state, sendData) => {
  const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${date}.csv`

  request.get(url, (error, { body } = {}) => {
    if (error) {
      sendData('Unable to connect to data source. Please try again.', undefined)
    } else {
      createJSON(body, state, date, sendData);
    }
  })
}

const createJSON = (csv, state, date, sendData) => {
  let filterOptions = {
      hasHeader: true,
      columnToFilter: 'Province_State',
      filterCriteria: state = state[0].toUpperCase() + state.substring(1),
      filterType: 'EXACT'
    }

  csvFilterSort.filter(csv, filterOptions, (error, filteredCSV) => {
    csvToJSON({
      output: 'json',
      headers: ['FIPS', 'County', 'State', 'Country', 'lastUpdated', 'Latitude', 'Longitude', 'Confirmed', 'Deaths', 'Recovered', 'Active', 'combinedKey'],
      ignoreColumns:  /(State|Country|Latitude|Longitude|lastUpdated|Active|combinedKey)/
    }).fromString(filteredCSV).then((jsonObj) => {
      if (jsonObj.length === 0) {
        sendData('No results found for that state or date range. Please try again.', undefined)
      } else {
        sendData(undefined, jsonObj);
      }
      
    })
  })
}

module.exports = getDataFromGithub;