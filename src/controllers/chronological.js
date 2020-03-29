const getData = require('../background/getData');

exports.getCountyData = (req, res) => {
  const query = req.query;

  getData.fromNYTimes(query, (error, results) => {
    if (error) {
      return res.send({ error })
    }

    res.send({
      chronological: {
        source: 'The New York Times',
        sourceURL: 'https://github.com/nytimes/covid-19-data',
        state: query.state,
        county: query.county,
        results
      }
    })
    
  });
}