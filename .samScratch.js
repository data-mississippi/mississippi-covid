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