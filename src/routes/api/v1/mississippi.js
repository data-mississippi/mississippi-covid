const router = require('express').Router();
const controller = require('../../../controllers/mississippi');

router.get('/', controller.getMSDeptOfHealthData);

module.exports = router;