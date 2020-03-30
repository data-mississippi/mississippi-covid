const router = require('express').Router();
const controller = require('../../../controllers/chronological')

router.get('/counties', controller.getCountyData);
router.get('/states', controller.getStateData);

module.exports = router;