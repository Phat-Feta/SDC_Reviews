const models = require('./models.js');

const getReviews = (req, res) => {
  let body = {
    product: req.query.product_id,
    count: req.query.count || 5
  };
  const queryReviews =
  `SELECT reviews.review_id, reviews.rating, reviews.date, reviews.summary, reviews.body, reviews.recommend, reviews.response, reviews.reviewer_name, reviews.helpfulness, ARRAY_AGG(photos.url) AS photos FROM reviews JOIN photos ON reviews.review_id=photos.review_id WHERE reviews.product=${Number(req.query.product_id)} GROUP BY reviews.review_id LIMIT ${Number(req.query.count) || 5};`
  models.get(queryReviews)
    .then(({rows}) => {
      body.results = rows;
    })
    .then(() => res.status(201).send(body))
    .catch(err => res.status(500).send(err))
}

const getMeta = (req, res) => {
  let body = {};
  const queryMeta =
  `SELECT meta.product_id,
    json_build_object(
      '1', meta.one,
      '2', meta.two,
      '3', meta.three,
      '4', meta.four,
      '5', meta.five
    ) AS ratings,
    json_build_object(
      'true', recommended.true,
      'false', recommended.false
    ) AS recommended
      FROM meta JOIN recommended ON meta.product_id=recommended.product_id WHERE meta.product_id=${Number(req.query.product_id)};`
  models.get(queryMeta)
    .then(({rows}) => {
      body = rows[0];
    })
    .then(() => {
      const queryCharacteristics =
      `SELECT * FROM characteristics WHERE product_id=${Number(req.query.product_id)};`
      return models.get(queryCharacteristics)
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
    .then(() => res.status(201).send(body))
    .catch(err => res.status(500).send(err))
}

const postReview = (req, res) => {
  // const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = req.body;
  // const queryNewReview =
  // `INSERT INTO reviews (product, rating, date, summary, body, recommend,reviewer_name) VALUES(${product_id}, ${rating}, ${Data.now()}, ${summary}, ${body}, ${recommend.toString()}, ${name});`
  // res.status(204).send();
}

module.exports = { getReviews, getMeta, postReview }