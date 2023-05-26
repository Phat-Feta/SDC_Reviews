const models = require('./models.js');

const getReviews = (req, res) => {
  console.log(req.query);
  const query =
  `SELECT * FROM reviews WHERE product=${Number(req.query.product_id)} LIMIT ${Number(req.query.counts) || 5};`
  models.get(query)
    .then(({rows}) => {res.status(201).send(rows)})
    .catch(err => res.status(500).send(err))
}

const getMeta = (req, res) => {
  let body = {
    ratings: {},
    recommended: {},
    characteristics: {}
  };
  const queryMeta =
  `SELECT * FROM meta WHERE product_id=${Number(req.query.product_id)};`
  models.get(queryMeta)
    .then(({rows}) => {
      body.product_id = rows[0].product_id;
      body.ratings = {
        '1': rows[0].one,
        '2': rows[0].two,
        '3': rows[0].three,
        '4': rows[0].four,
        '5': rows[0].five
      }
    })
    .then(() => {
      const queryCharacteristics =
      `SELECT * FROM characteristics WHERE product_id=${Number(req.query.product_id)};`
      return models.get(queryCharacteristics)
    })
    .then(({rows}) => {
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
    .then(() => {
      const queryRecommended =
      `SELECT * FROM recommended WHERE product_id=${Number(req.query.product_id)};`
      return models.get(queryRecommended);
    })
    .then(({rows}) => {
      body.recommended.true = rows[0].true;
      body.recommended.false = rows[0].false;
    })
    .then(() => res.status(201).send(body))
    .catch(err => res.status(500).send(err))
}

module.exports = { getReviews, getMeta }