const path = require('path');
const express = require('express');
const hbs = require('hbs');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
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


// setup swagger
const swaggerDefinition = {
  info: {
    title: 'COVID-19 API',
    version: '1.0.0',
    description: 'An open API for COVID-19 case data.'
  },
  customSiteTitle: 'docs',
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css'
}
const options = {
  swaggerDefinition,
  apis: ['./src/app.js']
}

const specs = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

// configure the routes
app.get('', (req, res) => {
  res.render('index', {
    title: 'Mississippi COVID-19'
  })
})


app.get('/about', (req, res) => {
  res.render('about', {
    title: 'about'
  })
})


app.get('/resources', (req, res) => {
  res.render('resources', {
    title: 'resources',
    helpText: 'Coronavirus outreach for Mississippi communities -- information and donate'
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

app.get('/news/rss', (req, res) => {
  getMSTodayRSS((feed) => {
    res.send(
      feed
    )
  })
})

/**
 * @swagger
 * /api/v1/daily/us:
 *   get:
 *     summary: Get a list of US's daily case numbers
 *     description: Returns a list of the US's daily case numbers. NOTE -- county data is not available before 03-23-2020, only state data.
 *     parameters:
 *       - in: query
 *         name: date
 *         type: string
 *         required: true
 *       - in: query
 *         name: state
 *         type: string
 *         required: false
 *     responses:
 *       200:
 *         description: List of the US's daily case numbers. Schema does not match what is currently returned.
 *         schema: 
 *           type: object
 *           properties:
 *             daily:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                 state:
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fips:
 *                         type: string
 *                       county:
 *                         type: string
 *                       lastUpdated:
 *                         type: string
 *                       confirmed:
 *                         type: string
 *                       deaths:
 *                         type: string
 */


/**
 * @swagger
 * /api/v1/daily/us/state:
 *   get:
 *     summary: Get each US state's daily case numbers
 *     description: Returns a list of a state's daily case numbers for each county. NOTE -- county data is not available before 03-23-2020, only state data.
 *     parameters:
 *       - in: query
 *         name: date
 *         type: string
 *         required: true
 *       - in: query
 *         name: state
 *         type: string
 *         required: false
 *     responses:
 *       200:
 *         description: List of a state's daily case numbers
 *         schema: 
 *           type: object
 *           properties:
 *             daily:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                 state:
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fips:
 *                         type: string
 *                       county:
 *                         type: string
 *                       lastUpdated:
 *                         type: string
 *                       confirmed:
 *                         type: string
 *                       deaths:
 *                         type: string
 */


/**
 * @swagger
 * /api/v1/daily/us/county:
 *   get:
 *     summary: Get each US county's daily case numbers
 *     description: Returns a list of daily case numbers for each US county. NOTE -- county data is not available before 03-23-2020, only state data.
 *     parameters:
 *       - in: query
 *         name: date
 *         type: string
 *         required: true
 *       - in: query
 *         name: state
 *         type: string
 *         required: false
 *     responses:
 *       200:
 *         description: List of a state's daily case numbers for each county
 *         schema: 
 *           type: object
 *           properties:
 *             daily:
 *               type: object
 *               properties:
 *                 date:
 *                   type: string
 *                 state:
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fips:
 *                         type: string
 *                       county:
 *                         type: string
 *                       lastUpdated:
 *                         type: string
 *                       confirmed:
 *                         type: string
 *                       deaths:
 *                         type: string
 */

app.get('/api/v1/daily/us', (req, res) => {
  let date = req.query.date;
  let state = false;

  if (!date) {
    let currentDate = createDateForQuery()
    return res.send({ error: `No date in query. ${currentDate} is the most recent.`})
  }

  getDataFromGithub(date, state, (error, results) => {
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

app.get('/api/v1/daily/us/state', (req, res) => {
  let date = req.query.date;
  let state = req.query.state;

  if (!date) {
    let currentDate = createDateForQuery()
    return res.send({ error: `No date in query. ${currentDate} is the most current based on our data.`})
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

app.get('/api/v1/daily/us/county', (req, res) => {
  let date = req.query.date;
  let state = req.query.state;
  
  if (!date) {
    let currentDate = createDateForQuery()
    return res.send({ error: `No date in query. ${currentDate} is the most recent.`})
  }

  if (!state) {
    state = 'all'
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

app.get('/data', (req, res) => {
  res.render('data', {
    title: 'data',
  })
})

app.get('/resources/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'sam mcalilly',
    errorMessage: 'help article not found'
  })
})

app.get('/test', (req, res) => {
  throw new Error('Something went wrong!');
})

app.use((error, req, res, next) => {
  console.error(error.stack);
  res.status(500).send('Something Broke!');
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