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
  },
  customSiteTitle: 'docs',
  customCssUrl: 'https://cdn.jsdelivr.net/npm/swagger-ui-themes@3.0.0/themes/3.x/theme-newspaper.css'
}

const options = {
  swaggerDefinition,
  apis: ['./src/routes/api/v1/index.js']
}

const specs = swaggerJSDoc(options);
router.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

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

module.exports = router;