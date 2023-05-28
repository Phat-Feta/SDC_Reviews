const { pool } = require('../db//poolConnection.js')

const getReviews = (product_id, count) => {
  const queryReviews =
  `SELECT reviews.review_id, reviews.rating, reviews.date, reviews.summary, reviews.body, reviews.recommend, reviews.response, reviews.reviewer_name, reviews.helpfulness,
  CASE
    WHEN COUNT(photos.url) = 0 THEN ARRAY[]::varchar[]
    ELSE ARRAY_AGG(photos.url)
  END AS photos
  FROM reviews LEFT JOIN photos ON reviews.review_id=photos.review_id WHERE reviews.product=${Number(product_id)} GROUP BY reviews.review_id LIMIT ${Number(count) || 5};`
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

const postNewReview = (form) => {
  const { product_id, rating, summary, body, recommend, name, email, photos, characteristics } = form;
  const queryNewReview =
  `INSERT INTO reviews (product, rating, date, summary, body, recommend, reviewer_name) VALUES(${product_id}, ${rating}, ${Date.now()}, '${summary}', '${body}', '${recommend.toString()}', '${name}');`
  console.log(queryNewReview);
  return pool.query(queryNewReview)
}

const postNewCharacteristics = (form) => {
  const { product_id, characteristics } = form;
  let review_id;
  let charNames;
  const queryLatestReview =
  `SELECT review_id FROM characteristics ORDER BY review_id DESC LIMIT 1`
  pool.query(queryLatestReview)
    .then(({rows}) => {
      review_id = Number(rows[0].review_id) + 1
    })
    .then(() => {
      const queryCharNames =
      `SELECT DISTINCT characteristic_id, name FROM characteristics WHERE product_id=${product_id}`
      return pool.query(queryCharNames)
    })
    .then(({rows}) => {
      const charValues = rows.map((char) => {
        return `(${product_id}, '${char.name}', ${char.characteristic_id}, ${review_id}, ${characteristics[char.characteristic_id]})`
      })
      const queryInsertChars =
      `INSERT INTO characteristics VALUES ${charValues.join(',')};`
      return pool.query(queryInsertChars)
    })
    .catch(err => console.error(err))

}

const putRecommend = (form) => {
  const { product_id, recommend } = form;
  if (recommend) {
    const queryRecommend =
    `UPDATE recommended SET "true"="true" + 1 WHERE product_id=${product_id}`
    return pool.query(queryRecommend)
  } else {
    const queryRecommend =
    `UPDATE recommended SET "false"="false" + 1 WHERE product_id=${product_id}`
    return pool.query(queryRecommend)
  }
}

const postNewPhotos = (form) => {
  const { photos } = form;
  const queryLatestReview =
  `SELECT review_id FROM reviews ORDER BY review_id DESC LIMIT 1`
  let review_id;
  pool.query(queryLatestReview)
    .then(({rows}) => {
      review_id = Number(rows[0].review_id)
    })
    .then(() => {
      const photoUrls = photos.map((url) => {
        return `(${review_id}, '${url}')`
      })
      const queryNewPhotos =
      `INSERT INTO photos (review_id, url) VALUES ${photoUrls.join(',')};`
      return pool.query(queryNewPhotos)
    })
    .catch(err => console.error(err))
}

const putMeta = (form) => {
  const { product_id, rating } = form;
  let col;
  if (rating === 1) {
    col = 'one'
  } else if (rating === 2) {
    col = 'two'
  } else if (rating === 3) {
    col = 'three'
  } else if (rating === 4) {
    col = 'four'
  } else {
    col = 'five'
  }

  const queryUpdateMeta =
  `UPDATE meta SET ${col}=${col} + 1 WHERE product_id=${product_id};`
  return pool.query(queryUpdateMeta)
}

const putReviewHelpful = (review_id) => {
  const queryPutHelpful =
  `UPDATE reviews SET helpfulness=helpfulness + 1 WHERE review_id=${review_id};`
  return pool.query(queryPutHelpful)
}

const putReviewReport = (review_id) => {
  const queryPutReport =
  `UPDATE reviews SET reported='true' WHERE review_id=${review_id};`
  return pool.query(queryPutReport)
}

module.exports = { getReviews, getMeta, getCharacteristics, postNewReview, postNewCharacteristics, postNewPhotos, putRecommend, putMeta, putReviewHelpful, putReviewReport }