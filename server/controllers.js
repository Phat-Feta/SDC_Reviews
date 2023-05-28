const models = require('./models.js');

const getReviews = (req, res) => {
  let body = {
    product: req.query.product_id,
    count: req.query.count || 5
  };
  models.getReviews(req.query.product_id, req.query.count)
    .then(({rows}) => {
      if (req.query.sort === 'newest') {
        rows.sort((a, b) => Number(b.date) - Number(a.date))
      } else {
        rows.sort((a, b) => b.helpfulness - a.helpfulness)
      }
      body.results = rows;
    })
    .then(() => res.status(200).send(body))
    .catch(err => res.status(500).send(err))
}

const getMeta = (req, res) => {
  let body = {};

  models.getMeta(req.query.product_id)
    .then(({rows}) => {
      body = rows[0];
    })
    .then(() => {
      return models.getCharacteristics(req.query.product_id)
    })
    .then(({rows}) => {
      body.characteristics = {};
      let chars = {
        Quality: {id: 0, value: []},
        Comfort: {id: 0, value: []},
        Fit: {id: 0, value: []},
        Length: {id: 0, value: []},
        Width: {id: 0, value: []},
        Size: {id: 0, value: []}
      };
      for (let i = 0; i < rows.length; i++) {
        chars[rows[i].name].value.push(rows[i].value)
        chars[rows[i].name].id = rows[i].characteristic_id
      }
      for (var key in chars) {
        if (chars[key].id) {
          body.characteristics[key] = {
            id: chars[key].id,
            value: chars[key].value.reduce((a,b) => a+b)/chars[key].value.length
          }
        }
      }
    })
    .then(() => res.status(200).send(body))
    .catch(err => res.status(500).send(err))
}

const postReview = (req, res) => {
  models.postNewReview(req.body)
    .then(() => {
      return models.postNewCharacteristics(req.body)
    })
    .then(() => {
      return models.putRecommend(req.body);
    })
    .then(() => {
      return models.postNewPhotos(req.body)
    })
    .then(()=> {
      return models.putMeta(req.body)
    })
    .then(() => {
      console.log('New review form submitted.')
      res.status(201).send();
    })
    .catch(err => res.status(500).send(err))

}

const putHelpful = (req, res) => {
  models.putReviewHelpful(req.params.review_id)
    .then(() => res.status(201).send())
    .catch(err => res.status(500).send(err))
}

const putReport = (req, res) => {
  models.putReviewReport(req.params.review_id)
    .then(() => res.status(201).send())
    .catch(err => res.status(500).send(err))
}

module.exports = { getReviews, getMeta, postReview, putHelpful, putReport }