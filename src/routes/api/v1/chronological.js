const router = require('express').Router();
const controller = require('../../../controllers/chronological')

router.get('/counties', controller.getCountyData);

module.exports = router;