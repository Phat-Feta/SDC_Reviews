const models = require('./models.js');

const getReviews = (req, res) => {
  models.get();
}

module.exports = { getReviews }