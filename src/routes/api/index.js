const router = require('express').Router();
const v1 = require('./v1/index');

router.use('/v1', v1);

module.exports = router;