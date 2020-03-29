const getData = require('../backgroundTasks/getData');

exports.getCountyData = (req, res) => {
  const query = req.query;

  query.county ? query.county : query.county = true;

  getData.fromNYTimes(query, (error, results) => {
    if (error) {
      return res.send({ error })
    }

    res.send({
      results
    })
  });
}