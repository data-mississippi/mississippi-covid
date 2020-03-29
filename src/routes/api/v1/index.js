const router = require('express').Router();
const daily = require('./daily');
const chronological = require('./chronological');

console.log('v1')

router.use('/chronological', chronological);
router.use('/daily', daily);

module.exports = router;