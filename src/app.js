const path = require('path');
const express = require('express');
const hbs = require('hbs');
const routes = require('./routes');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const getData = require('./backgroundTasks/getData');
const utcDate = require('./utils/date');
const getMSTodayRSS = require('./backgroundTasks/getMSTodayRSS');

const app = express();
const port = process.env.PORT || 3000;

//  Connect all our routes to our application
console.log(routes)
app.use('/', routes);

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
 *                 country:
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
 *                       state:
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
 * /api/v1/daily/us/states:
 *   get:
 *     summary: Get total case numbers per US state.
 *     description: Returns a count of a state's case numbers. Can get individual states or all.
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
 *                 source:
 *                   type: string
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
 * /api/v1/daily/us/counties:
 *   get:
 *     summary: Get each US county's daily case numbers
 *     description: Returns a list of daily case numbers for each US county. Can get individual states or all. NOTE -- county data is not available before 03-23-2020, only state data. 
 *        Sample query -- /api/v1/daily/us/counties?date=03-24-2020&state=mississippi
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
 *                 source:
 *                   type: string
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