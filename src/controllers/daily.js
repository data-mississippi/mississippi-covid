const getData = require('../backgroundTasks/getData');
const utcDate = require('../utils/date');

exports.getCountyData = (req, res) => {
  const query = req.query;
  query.county ? query.county : query.county = true;

  const currentDate = utcDate();
  
  if (!query.date || query.date > currentDate) {
    return res.send({ error: `Invalid date. Data from ${currentDate} is the most recent available. County data not available before 03-22-2020.`})
  }

  getData.fromJohnsHopkins(query, (error, results) => {
    if (error) {
      return res.send({ error })
    }
    
    res.send({
      daily: {
        source: 'Johns Hopkins University',
        date: query.date,
        state: query.state,
        results
      }
    })
  })
}

exports.getStateData = (req, res) => {
  const query = req.query;
  let currentDate = utcDate()

  if (!query.date || query.date >= currentDate) {
    return res.send({ error: `Invalid date. Data from ${currentDate} is the most recent available.`})
  }

  getData.fromJohnsHopkins(query, (error, results) => {
    if (error) {
      return res.send({ error })
    }

    res.send({
      daily: {
        source: 'Johns Hopkins University',
        date: query.date,
        state: query.state,
        results
      }
    })
  })
}