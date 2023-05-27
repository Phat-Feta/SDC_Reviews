const router = require('express').Router();
const controllers = require('./controllers.js');

router.get('/reviews', controllers.getReviews);
router.get('/meta', controllers.getMeta);
router.post('/reviews', controllers.postReview)

module.exports = router;