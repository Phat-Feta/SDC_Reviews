const models = require('./models.js');

const getReviews = (req, res) => {
  let body = {
    product: req.query.product_id,
    count: req.query.count || 5
  };
  models.getReviews(req.query.product_id, req.query.count)
    .then(({rows}) => {
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
  // const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = req.body;
  // const queryNewReview =
  // `INSERT INTO reviews (product, rating, date, summary, body, recommend, reviewer_name) VALUES(${product_id}, ${rating}, ${Data.now()}, ${summary}, ${body}, ${recommend.toString()}, ${name});`
  // res.status(201).send();
}

module.exports = { getReviews, getMeta, postReview }