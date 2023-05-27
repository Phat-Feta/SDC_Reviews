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

const charTempSchema =
  `CREATE TABLE IF NOT EXISTS charTemp (
    id integer PRIMARY KEY,
    characteristic_id integer,
    review_id integer,
    value integer
  );`

const charNameTempSchema =
  `CREATE TABLE IF NOT EXISTS charNameTemp (
    id integer PRIMARY KEY,
    product_id integer,
    name varchar
  );`

const charNameTempIdx =
  `CREATE INDEX idx_id_id ON charNameTemp (id)`

const charTempIdx =
  `CREATE INDEX idx_characteristic_id ON charTemp (characteristic_id)`

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
      const serialQuery = `SELECT SETVAL('reviews_review_id_seq', COALESCE(MAX(review_id), 1)) FROM reviews;`
      return client.query(serialQuery)
    })
    .then(() => {
      console.log('Reviews table populated')
      const insertPhotosQuery =
      `COPY photos FROM '/tmp/reviews_photos.csv' DELIMITER ',' CSV HEADER;`
      return client.query(insertPhotosQuery)
    })
    .then(() => {
      const serialQuery = `SELECT SETVAL('photos_id_seq', COALESCE(MAX(id), 1)) FROM photos;`
    })
    .then(() => {
      console.log('Photos table populated')
      return client.query(charTempSchema)
    })
    .then(() => {
      return client.query(charTempIdx)
    })
    .then(() => {
      const insertCharTempQuery =
      `COPY charTemp FROM '/tmp/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;`
      return client.query(insertCharTempQuery)
    })
    .then(() => {
      console.log('CharTemp table populated')
      return client.query(charNameTempSchema)
    })
    .then(() => {
      return client.query(charNameTempIdx)
    })
    .then(() => {
      const insertCharNameTempQuery =
      `COPY charNameTemp FROM '/tmp/characteristics.csv' DELIMITER ',' CSV HEADER;`
      return client.query(insertCharNameTempQuery)
    })
    .then(() => {
      console.log('CharNameTemp table populated')
      const insertCharacteristicsQuery =
      `INSERT INTO characteristics (characteristic_id, review_id, value) SELECT characteristic_id, review_id, value FROM charTemp`
      return client.query(insertCharacteristicsQuery)
    })
    .then(() => {
      console.log('Characteristics table populated')
      const insertCharNameQuery =
      `UPDATE characteristics SET name=(SELECT name FROM charNameTemp WHERE id=characteristics.characteristic_id), product_id=(SELECT product_id FROM charNameTemp WHERE id=characteristics.characteristic_id);`
      return client.query(insertCharNameQuery)
    })
    .then(() => {
      console.log('Characteristics table updated')
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
      console.log('Updated one star ratings for all products')
      const twoQuery =
      `UPDATE meta SET two=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=2);`
      return client.query(twoQuery)
    })
    .then(() => {
      console.log('Updated two star ratings for all products')
      const threeQuery =
      `UPDATE meta SET three=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=3);`
      return client.query(threeQuery)
    })
    .then(() => {
      console.log('Updated three star ratings for all products')
      const fourQuery =
      `UPDATE meta SET four=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=4);`
      return client.query(fourQuery)
    })
    .then(() => {
      console.log('Updated four star ratings for all products')
      const fiveQuery =
      `UPDATE meta SET five=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=5);`
      return client.query(fiveQuery)
    })
    .then(() => {
      console.log('Updated five star ratings for all products')
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
      return client.query('DROP TABLE temp;')
    })
    .then(()=> {
      return client.query('DROP TABLE charnametemp;')
    })
    .then(()=> {
      return client.query('DROP TABLE chartemp;')
    })
    .then(() => {
      console.log('Dropped temporary tables')
      console.log('Finished seeding database!')
    })
    .then(() => {
      pool.end();
    })
    .catch((err) => console.error('Error executing seed queries', err))
  done();
});
