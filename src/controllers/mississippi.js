const getDatafromMSDeptOfHealth = require('../background/fromMSDeptOfHealth')

exports.getMSDeptOfHealthData = (req, res) => {
  const query = req.query;

  getDatafromMSDeptOfHealth(query, (error, results) => {
    if (error) {
      res.send({ error })
    }
    res.send(
      results
    )
  })
}