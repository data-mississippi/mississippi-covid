const request = require('request');
const csvToJSON = require('csvtojson')
const csvFilterSort = require('csv-filter-sort');

const fromNYTimes = ({ state }) => {
  url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv'

  request.get(url, (error, { body } = {}) => {
    if (error) {
      sendData('Unable to connect to data source. Please try again.', undefined)
    } else {
      console.log(body)
    }
  })
}

const fromJohnsHopkins = ({ date, state = 'all', county}, sendData) => {
  const url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_daily_reports/${date}.csv`

  request.get(url, (error, { body } = {}) => {
    if (error) {
      sendData('Unable to connect to data source. Please try again.', undefined)
    } else {
      createJSON(body, date, state, county, sendData);
    }
  })
}

const createJSON = (csv, date, state, county, sendData) => {
  let oldFormat = false;
  if (date <= '03-21-2020') {
    oldFormat = true
  }
  const csvFilterOptions = setCsvFilterOptions(state, oldFormat);
  const jsonOptions = setJsonOptions(oldFormat);

  csvFilterSort.filter(csv, csvFilterOptions, (error, filteredCSV) => {
    csvToJSON(jsonOptions).fromString(filteredCSV).then((jsonObj) => {
      if (jsonObj.length === 0) {
        sendData('No results found for that state or date range. Please try again.', undefined)
      } else if (state && !county && !oldFormat) {
        const stateTotal = countStateCases(jsonObj);
        sendData(undefined, stateTotal);
      } else {
        sendData(undefined, jsonObj);
      }
    })
  })
}

const setJsonOptions = (oldFormat) => {
  let jsonOptions = {
    output: 'json',
    headers: ['fips', 'county', 'state', 'country', 'lastUpdated', 'latitude', 'longitude', 'confirmed', 'deaths', 'recovered', 'active', 'combinedKey'],
    ignoreColumns: /(country|latitude|longitude|recovered|active|combinedKey)/
  }

  if (oldFormat) {
    jsonOptions = {
      headers: ['provinceState', 'countryRegion', 'lastUpdated', 'confirmed', 'deaths', 'recovered', 'latitude', 'longitude'],
      ignoreColumns: /(countryRegion|recovered|latitude|longitude)/
    }
  }

  return jsonOptions;
}

const setCsvFilterOptions = (state, oldFormat) => {
  let filterOptions = {
    hasHeader: true,
    columnToFilter: 'Country_Region',
    filterCriteria: 'US',
    filterType: 'EXACT',
  }

  if (state && state != 'all') {
    // this is so hacky. i'm passing in "ALL" from daily/us/county, 
    // so i can add it back to the response body
    // need to figure out better way to handle these queries
    // also having to match the upperCase to parse the CSV

    filterOptions = {
      columnToFilter: 'Province_State',
      filterCriteria: state = state[0].toUpperCase() + state.substring(1),
      filterType: 'EXACT'
    }
  } else if (state === 'all') {
    filterOptions = {
      columnToFilter: 'Country_Region',
      filterCriteria: 'US',
      filterType: 'EXACT'
    }
  }

  // they changed their csv format on 03-23-2020
  if (oldFormat && state != 'all') {
    console.log('truthy')
    filterOptions = {
      columnToFilter: 'Province/State',
      filterCriteria: state = state[0].toUpperCase() + state.substring(1),
      filterType: 'EXACT'
    }
  } else if (oldFormat) {
    filterOptions = {
      columnToFilter: 'Country/Region',
      filterCriteria: 'US',
      filterType: 'EXACT'
    }
  } 

  return filterOptions;
}

const countStateCases = (jsonObj) => {
  let stateMap = {}

  jsonObj.forEach(json => {
    let currentState = json.state;
    
    if (!stateMap.hasOwnProperty(currentState)) {
      let stateTotal = {
        state: currentState,
        confirmed: 0,
        deaths: 0,
        lastUpdated: jsonObj[0].lastUpdated
      }
      stateMap[currentState] = stateTotal;
      stateMap[currentState].confirmed += parseInt(json.confirmed)
      stateMap[currentState].deaths += parseInt(json.deaths)
      stateMap[currentState].lastUpdated = json.lastUpdated
    } else {
      stateMap[currentState].confirmed += parseInt(json.confirmed)
      stateMap[currentState].deaths += parseInt(json.deaths)
    }
  })

  let stateArray = Object.values(stateMap)

  return stateArray;
}

module.exports = {
  fromJohnsHopkins: fromJohnsHopkins,
  fromNYTimes: fromNYTimes
}