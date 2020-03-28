const request = require('request');
const csvToJSON = require('csvtojson')
const csvFilterSort = require('csv-filter-sort');
const createDateForQuery = require('./date');

const getDataFromGithub = (date, state, sendData) => {
  if (!date) {
    date = createDateForQuery();
  }

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
  let csvFilterOptions = {
    hasHeader: true,
    columnToFilter: 'Country_Region',
    filterCriteria: 'US',
    filterType: 'EXACT',
  }

  let csvToJsonOptions = {
    output: 'json',
    headers: ['fips', 'county', 'state', 'country', 'lastUpdated', 'latitude', 'longitude', 'confirmed', 'deaths', 'recovered', 'active', 'combinedKey'],
    ignoreColumns: /(country|latitude|longitude|recovered|active|combinedKey)/
  }

  // they changed their csv format on 03-23-2020
  if (date < '03-23-2020') {
    csvFilterOptions = {
      columnToFilter: 'Country/Region',
      filterCriteria: 'US',
      filterType: 'EXACT'
    }
  }

  if (state && state != 'all') {
    // this is so hacky. i'm passing in "ALL" from daily/us/county, 
    // so i can add it back to the response body
    // need to figure out better way to handle these queries
    // also having to match the upperCase to parse the CSV

    csvFilterOptions = {
      columnToFilter: 'Province_State',
      filterCriteria: state = state[0].toUpperCase() + state.substring(1),
      filterType: 'EXACT'
    }
  } else if (state === 'all') {
    csvFilterOptions = {
      columnToFilter: 'Country_Region',
      filterCriteria: 'US',
      filterType: 'EXACT'
    }
  }

  csvFilterSort.filter(csv, csvFilterOptions, (error, filteredCSV) => {
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