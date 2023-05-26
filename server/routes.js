const router = require('express').Router();
const controllers = require('./controllers.js');

router.get('/reviews', controllers.getReviews)

module.exports = router;