const request = require('request');
const createJSON = require('./utils/createJSON');
const axios = require("axios");

const fromNYTimes = ({ state, county }, sendData) => {
  let url = ''
  if (county) {
    url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv'
  } else {
    url = 'https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv'
  }

  request.get(url, (error, { body } = {}) => {
    if (error) {
      sendData('Unable to connect to data source. Please try again.', undefined)
    } else {
      let date = false;
      createJSON(body, date, state, county, sendData)
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

module.exports = {
  fromJohnsHopkins: fromJohnsHopkins,
  fromNYTimes: fromNYTimes
}