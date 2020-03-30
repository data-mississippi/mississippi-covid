const csvToJSON = require('csvtojson')
const csvFilterSort = require('csv-filter-sort');

// this is the worst code i've ever written :(
// it gets worse the more i add to it :(
// should probably not use npm packages to do my filters and json conversion

const createJSON = (csv, date, state, county, sendData) => {
  let oldFormat = false;
  if (date <= '03-21-2020') {
    oldFormat = true
  }

  let nytimes = false;
  
  if (!date) {
    nytimes = true;
  }

  const csvFilterOptions = setCsvFilterOptions(state, oldFormat, nytimes);
  const jsonOptions = setJsonOptions(oldFormat, nytimes);

  
  if (nytimes && !state && county == 'all') {
    // can't filter csv that doesn't need filtering, so only convert json
    csvToJSON(jsonOptions).fromString(csv).then((jsonArray) => {
      if (jsonArray.length === 0) {
        sendData('No results found for that query. Please try again.', undefined)
      } else {
        sendData(undefined, jsonArray)
      }
    })
  } else {
    // i guess this is the callback hell they speak of, i'm not a fan
    csvFilterSort.filter(csv, csvFilterOptions, (error, filteredCSV) => {
      console.log('filteredCSV', filteredCSV)
      csvToJSON(jsonOptions).fromString(filteredCSV).then((jsonArray) => {
        if (jsonArray.length === 0) {
          sendData('No results found for that query. Please try again.', undefined)
        } else if (state && !county && !oldFormat & !nytimes) {
          const stateTotal = countStateCases(jsonArray);
          sendData(undefined, stateTotal);
        } else if (county && county !== 'all') {
          const countyRecord = filterByCounty(jsonArray, county);
          sendData(undefined, countyRecord)
        } else {
          sendData(undefined, jsonArray);
        }
      })
    })
  }

}

const setJsonOptions = (oldFormat, nytimes) => {
  let jsonOptions = {
    output: 'json',
    noheader: 'true',
    headers: ['fips', 'county', 'state', 'country', 'lastUpdated', 'latitude', 'longitude', 'confirmed', 'deaths', 'recovered', 'active', 'combinedKey'],
    ignoreColumns: /(country|latitude|longitude|recovered|active|combinedKey)/
  }

  if (oldFormat) {
    jsonOptions = {
      noheader: 'true',
      headers: ['provinceState', 'countryRegion', 'lastUpdated', 'confirmed', 'deaths', 'recovered', 'latitude', 'longitude'],
      ignoreColumns: /(countryRegion|recovered|latitude|longitude)/
    }
  }

  if (nytimes) {
    jsonOptions = {
      output: 'json',
      headers: ['date', 'county', 'state', 'fips', 'cases', 'deaths']
    }
  }

  return jsonOptions;
}

const setCsvFilterOptions = (state, oldFormat, nytimes) => {
  let filterOptions = {
    hasHeader: true,
    columnToFilter: 'Country_Region',
    filterCriteria: 'US',
    filterType: 'EXACT',
  }

  if (nytimes && state) {
    filterOptions = {
      hasHeader: true,
      columnToFilter: 'state',
      filterCriteria: state = state[0].toUpperCase() + state.substring(1),
      filterType: 'EXACT'
    }
  } else if (nytimes) {
    filterOptions = {
      hasHeader: true
    }
  }

  if (state && state != 'all' && !nytimes) {
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

const filterByCounty = (jsonArray, county) => {
  county = county[0].toUpperCase() + county.substring(1)
  const countyData = jsonArray.filter((json) => {
    return json.county === county;
  })

  return countyData;
}

const countStateCases = (jsonArray) => {
  let stateMap = {}

  

  jsonArray.forEach(json => {
    let currentState = json.state;
    let currentConfirmed = json.confirmed;
    let currentDeaths = json.deaths;
    
    if (!stateMap.hasOwnProperty(currentState)) {
      console.log('state not in map')
      
      let stateTotal = {
        state: currentState,
        confirmed: 0,
        deaths: 0,
        lastUpdated: json.lastUpdated
      }
      stateMap[currentState] = stateTotal;
      stateMap[currentState].confirmed += parseInt(currentConfirmed)
      stateMap[currentState].deaths += parseInt(currentDeaths)
    } else {
      stateMap[currentState].confirmed += parseInt(currentConfirmed)
      stateMap[currentState].deaths += parseInt(currentDeaths)
    }

    console.log(json)
    
  })
  console.log('stateMap', stateMap);

  let stateArray = Object.values(stateMap)

  return stateArray;
}

module.exports = createJSON;