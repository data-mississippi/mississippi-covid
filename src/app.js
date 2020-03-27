const path = require('path');
const express = require('express');
var hbs = require('hbs');
const getDataFromGithub = require('./utils/getDataFromGithub');
const createDateForQuery = require('./utils/date');
const getMSTodayRSS = require('./utils/getMSTodayRSS');

const app = express();
const port = process.env.PORT || 3000;

// define paths for express config
const PUBLIC_DIRECTORY = path.join(__dirname, '../public');
const VIEWS_PATH = path.join(__dirname, '../templates/views');
const PARTIALS_PATH = path.join(__dirname, '../templates/partials');

// set the templating engine and view path
app.set('view engine', 'hbs');
app.set('views', VIEWS_PATH);
hbs.registerPartials(PARTIALS_PATH);

// setup root route
app.use(express.static(PUBLIC_DIRECTORY));

// configure the routes
app.get('', (req, res) => {
  res.render('index', {
    title: 'Mississippi COVID-19',
    name: 'sam mcalilly'
  })
})


app.get('/about', (req, res) => {
  res.render('about', {
    title: 'about',
    name: 'sam mcalilly'
  })
})


app.get('/help', (req, res) => {
  res.render('help', {
    title: 'help',
    helpText: 'this is some helpful text',
    name: 'sam mcalilly'
  })
})

app.get('/news', (req, res) => {
  getMSTodayRSS((feed) => {
    res.render('news', {
      title: 'news',
      feed: feed.items
    })
  })
})


/**
 * @swagger
 * /api/v1/daily:
 *   get:
 *     summary: Get each county's daily case numbers
 *     description: Returns a list of a state's daily case numbers for each county
 *     tags:
 *       - counties
 *     parameters:
 *       - in: query
 *         name: state
 *         type: string
 *         required: true
 *         enum:
 *           - yes
 *           - no
 *       - in: query
 *         name: date
 *         type: 
 *     responses:
 *       200:
 *         description: List of animals
 *         schema:
 *           type: object
 *           properties:
 *             animals:
 *               type: array
 *               description: all the animals
 *               items:
 *                 type: string
 */


app.get('/api/v1/daily', (req, res) => {
  let date = req.query.date;
  let state = req.query.state;

  if (!state) {
    return res.send({
      error: 'you must provide a state'
    })
  }
  
  if (!date) {
    date = createDateForQuery();
  }

  getDataFromGithub(date, state, (error, results) => {
    if (error) {
      return res.send({ error })
    }
    
    res.send({
      daily: {
        date: date,
        state: state,
        results
      }
    })
  })
})

app.get('/api', (req, res) => {
  res.render('api', {
    title: 'api',

  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'sam mcalilly',
    errorMessage: 'help article not found'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'sam mcalilly',
    errorMessage: 'page not found'
  })
})

// setup the server to listen to a port
app.listen(port, () => {
  console.log('server started on port' + port)
})