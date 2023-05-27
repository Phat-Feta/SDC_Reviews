const router = require('express').Router();
const controllers = require('./controllers.js');

router.get('/reviews', controllers.getReviews);
router.get('/reviews/meta', controllers.getMeta);
router.post('/reviews', controllers.postReview)
router.put('/reviews/:review_id/helpful', controllers.putHelpful)
router.put('/reviews/:review_id/report', controllers.putReport)

module.exports = router;