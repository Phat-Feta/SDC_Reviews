const { pool } = require('../db//poolConnection.js')

const getReviews = (product_id, count) => {
  const queryReviews =
  `SELECT reviews.review_id, reviews.rating, reviews.date, reviews.summary, reviews.body, reviews.recommend, reviews.response, reviews.reviewer_name, reviews.helpfulness, ARRAY_AGG(photos.url) AS photos FROM reviews JOIN photos ON reviews.review_id=photos.review_id WHERE reviews.product=${Number(product_id)} GROUP BY reviews.review_id LIMIT ${Number(count) || 5};`
  return pool.query(queryReviews)
}

const getMeta = (product_id) => {
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
      FROM meta JOIN recommended ON meta.product_id=recommended.product_id WHERE meta.product_id=${Number(product_id)};`
  return pool.query(queryMeta)
}

const getCharacteristics = (product_id) => {
  const queryCharacteristics =
  `SELECT * FROM characteristics WHERE product_id=${Number(product_id)};`
  return pool.query(queryCharacteristics)
}

const post = (query) => {
  return pool.query(query)
}

const put = (query) => {
  return pool.query(query)
}

module.exports = { getReviews, getMeta, getCharacteristics, post }