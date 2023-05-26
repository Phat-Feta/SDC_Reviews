const { pool } = require('./poolConnection.js')

const tempSchema =
  `CREATE TABLE IF NOT EXISTS temp (
    id integer,
    product_id integer,
    rating integer,
    date varchar,
    summary varchar,
    body varchar,
    recommend varchar,
    reported varchar,
    response varchar,
    reviewer_name varchar,
    reviewer_email varchar,
    helpfulness integer
  );`

pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to db ', err);
    return;
  }
  console.log('Connected to db successfully')

  client.query(tempSchema)
    .then(() => {
      console.log('Temp table created or already exists.')
      return client.query('SELECT COUNT(*) FROM temp')
    })
    .then((result) => {
      if (result.rows[0].count === '0') {
        const insertTempQuery = `COPY temp FROM '/tmp/reviews.csv' DELIMITER ',' CSV HEADER;`
        return client.query(insertTempQuery)
      }
    })
    .then(() => {
      console.log('Temp table populated')
      return client.query('SELECT COUNT(*) FROM reviews;')
    })
    .then((result) => {
      const reviewCount = result.rows[0].count;
      console.log(`Counted ${reviewCount} reviews`)
      if (reviewCount === '0') {
        const insertReviewsQuery =
        `INSERT INTO reviews SELECT id, product_id, rating, date, summary, body, recommend, reported, response, reviewer_name, helpfulness FROM temp`
        return client.query(insertReviewsQuery)
      }
    })
    .then(() => {
      console.log('Reviews table populated')
      const insertPhotosQuery =
      `COPY photos FROM '/tmp/reviews_photos.csv' DELIMITER ',' CSV HEADER;`
      return client.query(insertPhotosQuery)
    })
    .then(() => {
      console.log('Photos table populated')
      const insertCharacteristicsQuery =
      `COPY characteristics FROM '/tmp/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;`
      return client.query(insertCharacteristicsQuery)
    })
    .then(() => {
      console.log('Characteristics table populated')
      const distinctQuery =
        `INSERT INTO meta SELECT DISTINCT product from reviews;`
      return client.query(distinctQuery)
    })
    .then(() => {
      console.log(`Meta table populated with distinct products`)
      const oneQuery =
      `UPDATE meta SET one=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=1);`
      return client.query(oneQuery)
    })
    .then(() => {
      console.log('updated one star ratings for all products')
      const twoQuery =
      `UPDATE meta SET two=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=2);`
      return client.query(twoQuery)
    })
    .then(() => {
      console.log('updated two star ratings for all products')
      const threeQuery =
      `UPDATE meta SET three=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=3);`
      return client.query(threeQuery)
    })
    .then(() => {
      console.log('updated three star ratings for all products')
      const fourQuery =
      `UPDATE meta SET four=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=4);`
      return client.query(fourQuery)
    })
    .then(() => {
      console.log('updated four star ratings for all products')
      const fiveQuery =
      `UPDATE meta SET five=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=5);`
      return client.query(fiveQuery)
    })
    .then(() => {
      console.log('updated five star ratings for all products')
      const recommendedQuery =
      `INSERT INTO recommended SELECT DISTINCT product from reviews;`
      return client.query(recommendedQuery);
      })
    .then(() => {
      console.log('Recommended table populated with distinct products')
      const insertTrueQuery =
      `UPDATE recommended SET "true"=(SELECT COUNT(*) FROM reviews WHERE product=recommended.product_id AND recommend='true')`
      return client.query(insertTrueQuery);
    })
    .then(() => {
      console.log('Updated recommended with true values')
      const insertFalseQuery =
      `UPDATE recommended SET "false"=(SELECT COUNT(*) FROM reviews WHERE product=recommended.product_id AND recommend='false')`
      return client.query(insertFalseQuery);
    })
    .then(() => {
      console.log('Updated recommended with false values')
      console.log('Finished seeding database!')
      return client.query('DROP TABLE temp;')
    })
    .then(() => {
      pool.end();
    })
    .catch((err) => console.error('Error executing seed queries', err))
  done();
});
