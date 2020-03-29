const router = require('express').Router();
const utcDate = require('../../../utils/date');
const getData = require('../../../backgroundTasks/getData');

router.get('/us/counties', (req, res) => {
  const query = req.query;
  query.county = true;
  let currentDate = utcDate()
  
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
})

router.get('/us/states', (req, res) => {
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
})

router.get('/daily/us', (req, res) => {
  let date = req.query.date;
  let state = false;

  if (!date) {
    let currentDate = utcDate()
    return res.send({ error: `No date in query. ${currentDate} is the most recent.`})
  }

  getData.fromJohnsHopkins({ date, state }, (error, results) => {
    if (error) {
      return res.send({ error })
    }

    res.send({
      daily: {
        date: date,
        country: 'US',
        results
      }
    })
  })
})


module.exports = router;