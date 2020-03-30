const router = require('express').Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const daily = require('./daily');
const chronological = require('./chronological');

router.use('/daily', daily);
router.use('/chronological', chronological);

// setup swagger
const swaggerDefinition = {
  info: {
    title: 'COVID-19 API',
    version: '1.0.0',
    description: 'An open API for COVID-19 case data.'
  }
}

const options = {
  swaggerDefinition,
  apis: ['./src/routes/api/v1/index.js']
}

const specs = swaggerJSDoc(options);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

 /** 
 * @swagger
 * /api/v1/chronological/counties:
 *   get:
 *     summary: Get a chronological list of daily case numbers for each US county
 *     description: Returns a chronological list of total case count in every US county, starting with the first reported case. It only includes a county if there are any reported cases for that county. Each day includes the prior day’s count and adds to that count if there are any new cases. Can filter by state and county.
 *        Sample query -- /api/v1/daily/chronological/counties?state=mississippi
 *     parameters:
 *       - in: query
 *         name: state
 *         type: string
 *         required: false
 *       - in: query
 *         name: county
 *         type: string
 *         required: false
 *     responses:
 *       200:
 *         description: A chronological list of total case numbers for each county.
 *         schema: 
 *           type: object
 *           properties:
 *             daily:
 *               type: object
 *               properties:
 *                 source:
 *                   description: Source for this data. Please attribute if you use it anywhere.
 *                   type: string
 *                 sourceURL:
 *                   description: URL for the source.
 *                   type: string
 *                 state:
 *                   description: The state where the cases are located.
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         description: Date for the the case count.
 *                         type: string
 *                       county:
 *                         description: The county name for the case count.
 *                         type: string
 *                       state:
 *                         description: The US state for the case count.
 *                         type: string
 *                       fips:
 *                         description: Federal Information Processing Standard county code to uniquely identify counties.
 *                         type: string
 *                       cases:
 *                         description: Count of confirmed COVID-19 cases.
 *                         type: string
 *                       deaths:
 *                         description: Deaths attributed to COVID-19.
 *                         type: string
 *   
 */

 /** 
 * @swagger
 * /api/v1/chronological/states:
 *   get:
 *     summary: Get a chronological list of daily case numbers for each US state
 *     description: Returns a chronological list of total case count in every US state, starting with the first reported case. It only includes a state if there are any reported cases for that state. Each day includes the prior day’s count and adds to that count if there are any new cases. Can filter by state or return all states.
 *        Sample query -- /api/v1/daily/chronological/states?state=mississippi
 *     parameters:
 *       - in: query
 *         name: state
 *         type: string
 *         required: false
 *     responses:
 *       200:
 *         description: A chronological list of total case numbers for each state.
 *         schema: 
 *           type: object
 *           properties:
 *             daily:
 *               type: object
 *               properties:
 *                 source:
 *                   description: Source for this data. Please attribute if you use it anywhere.
 *                   type: string
 *                 sourceURL:
 *                   description: URL for the source.
 *                   type: string
 *                 state:
 *                   description: The state where the cases are located.
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         description: Date for the the case count.
 *                         type: string
 *                       state:
 *                         description: The state for the case count.
 *                         type: string
 *                       fips:
 *                         description: Federal Information Processing Standard state code to uniquely identify states.
 *                         type: string
 *                       cases:
 *                         description: Count of confirmed COVID-19 cases.
 *                         type: string
 *                       deaths:
 *                         description: Deaths attributed to COVID-19.
 *                         type: string
 *   
 */


/**
 * @swagger
 * /api/v1/daily/us/counties:
 *   get:
 *     summary: Get each US county's daily case numbers
 *     description: Returns one single day for all US counties. Date is required. Can filter by state and county. NOTE -- county data is not available before 03-23-2020, only state data. 
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
 *       - in: query
 *         name: county
 *         type: string
 *         required: false
 *     responses:
 *       200:
 *         description: List of each US county's daily case numbers
 *         schema: 
 *           type: object
 *           properties:
 *             daily:
 *               type: object
 *               properties:
 *                 source:
 *                   description: Source for this data. Please attribute if you use it anywhere.
 *                   type: string
 *                 sourceURL:
 *                   description: URL for the source.
 *                   type: string
 *                 date:
 *                   description: Date for the cases.
 *                   type: string
 *                 state:
 *                   description: The state where the county is located.
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fips:
 *                         description: Federal Information Processing Standard county code to uniquely identify counties.
 *                         type: string
 *                       county:
 *                         description: The county name for the case count.
 *                         type: string
 *                       lastUpdated:
 *                         description: The time when this data was last updated.
 *                         type: string
 *                       confirmed:
 *                         description: Confirmed COVID-19 cases.
 *                         type: string
 *                       deaths:
 *                         descriptions: Deaths attributed to COVID-19.
 *                         type: string
 */

 /**
 * @swagger
 * /api/v1/daily/us/states:
 *   get:
 *     summary: Get total case numbers for each US state.
 *     description: Returns a single day for all US counties. Date is required. Can filter by state.
 *        Sample query -- /api/v1/daily/us/states?date=03-28-2020&state=mississippi
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
 *             chronological:
 *               type: object
 *               properties:
 *                 source:
 *                   description: Source for this data. Please attribute if you use it anywhere.
 *                   type: string
 *                 sourceURL:
 *                   description: URL for the source.
 *                   type: string
 *                 date:
 *                   description: Date for the cases.
 *                   type: string
 *                 state:
 *                   type: string
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       state:
 *                         description: The state for the case count.
 *                         type: string
 *                       confirmed:
 *                         description: Confirmed COVID-19 cases.
 *                         type: string
 *                       deaths: 
 *                         description: Deaths attributed to COVID-19.
 *                         type: string
 *                       lastUpdated: 
 *                         description: The time when this data was last updated.
 *                         type: string
 *                 
 */

module.exports = router;