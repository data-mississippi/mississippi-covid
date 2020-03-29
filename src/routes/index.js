const router = require('express').Router();
const api = require('./api/index');

router.use('/api', api)

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Mississippi COVID-19'
  });
});

module.exports = router;