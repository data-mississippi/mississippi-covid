const path = require('path');
const express = require('express');
var hbs = require('hbs');
const getDataFromGithub = require('./utils/getDataFromGithub');
const createDateForQuery = require('./utils/date');

const app = express();

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
    title: 'mississippi',
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
app.listen(3000, () => {
  console.log('server started on port 3000')
})