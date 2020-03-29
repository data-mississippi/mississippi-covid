const router = require('express').Router();
const controller = require('../../../controllers/daily');

router.get('/us/counties', controller.getCountyData)
router.get('/us/states', controller.getStateData);

module.exports = router;