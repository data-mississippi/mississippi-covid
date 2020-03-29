const router = require('express').Router();
const api = require('./api/index');
const getMSTodayRSS = require('../backgroundTasks/getMSTodayRSS');

router.use('/api', api)

router.get('/', (req, res) => {
  res.render('index', {
    title: 'Mississippi COVID-19'
  });
});

router.get('/data', (req, res) => {
  res.render('data', {
    title: 'data',
  })
})

router.get('/about', (req, res) => {
  res.render('about', {
    title: 'about'
  })
})

router.get('/news', (req, res) => {
  getMSTodayRSS((feed) => {
    res.render('news', {
      title: 'news',
      feed: feed.items
    })
  })
})

router.get('/news/rss', (req, res) => {
  getMSTodayRSS((feed) => {
    res.send(
      feed
    )
  })
})

router.get('/resources', (req, res) => {
  res.render('resources', {
    title: 'resources',
    helpText: 'Coronavirus outreach for Mississippi communities -- information and donate'
  })
})

module.exports = router;