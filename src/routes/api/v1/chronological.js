const router = require('express').Router();
const getData = require('../../../backgroundTasks/getData');

router.get('/', (req, res) => {
  const query = req.query;

  getData.fromNYTimes(query, (error, results) => {
    if (error) {
      return res.send({ error })
    }

    res.send({
      results
    })
  });
})

module.exports = router;