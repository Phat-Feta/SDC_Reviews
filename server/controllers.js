const models = require('./models.js');

const getReviews = (req, res) => {
  console.log(req.query);
  const query =
  `SELECT * FROM reviews WHERE product=${Number(req.query.product_id)} LIMIT ${Number(req.query.counts)};`
  models.get(query)
    .then(({rows}) => {res.status(201).send(rows)})
    .catch(err => res.status(500).send(err))
}

const getMeta = (req, res) => {
  let body = {};
  let ratings = {};
  let recommened = {};
  let characteristics = {};
  const queryMeta =
  `SELECT * FROM meta WHERE product_id=${Number(req.query.product_id)} UNION ALL
  SELECT * FROM characteristics WHERE id=${Number(req.query.product_id)} UNION ALL
  SELECT * FROM recommended WHERE product_id=${Number(req.query.product_id)};`
  models.get(queryMeta)
    .then(({rows}) => {
      console.log(rows)
      body.product_id = rows[0].product_id;
      ratings['1'] = rows[0].one;
      ratings['2'] = rows[0].two;
      ratings['3'] = rows[0].three;
      ratings['4'] = rows[0].four;
      ratings['5'] = rows[0].five;
      body.ratings = ratings;
    })
    .then(() => res.status(201).send(body))
    .catch(err => res.status(500).send(err))
}

module.exports = { getReviews, getMeta }