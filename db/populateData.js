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
    .then(console.log('Temp table created or already exists.'))
    .catch(err => console.error('Error creating temp table:', err))

  client.query('SELECT COUNT(*) FROM temp')
    .then((res) => {
      if (Number(res.rows.count) === 0) {
        const insertTempQuery = `COPY temp FROM '/tmp/reviews.csv' DELIMITER ',' CSV HEADER;`
        client.query(insertTempQuery)
          .then(() => console.log('Temp table populated'))
          .catch((err) => console.error('Error populating temp table', err))
      }
    })
    .catch((err) => console.error('Error counting from temp', err))

  client.query('SELECT COUNT(*) FROM reviews;')
    .then(result => {
      const reviewCount = result.rows[0].count;
      console.log(`Counted ${reviewCount} reviews`)
      if (Number(reviewCount) === 0) {
        const insertReviewsQuery =
        `INSERT INTO reviews SELECT id, product_id, rating, date, summary, body, recommend, reported, response, reviewer_name, helpfulness FROM temp`
        client.query(insertReviewsQuery)
          .then(() => console.log('Reviews table populated'))
          .catch((err) => console.error('Error populating reviews table', err))
      }
    })
    .catch(err => console.error(err))

  // const insertPhotosQuery =
  // `COPY photos FROM '/tmp/reviews_photos.csv' DELIMITER ',' CSV HEADER;`
  // client.query(insertPhotosQuery)
  //   .then(() => console.log('Photos table populated'))
  //   .catch(err => console.error('Error populating photos table', err))

  const insertCharacteristicsQuery =
  `COPY characteristics FROM '/tmp/characteristic_reviews.csv' DELIMITER ',' CSV HEADER;`
  console.log('Inserting into characteristics table...')
  client.query(insertCharacteristicsQuery)
    .then(() => console.log('Characteristics table populated'))
    .catch(err => console.error('Error populating characteristics table', err))
  // const ratings = ['one','two','three','four','five']
  // const distinctQuery =
  //   `INSERT INTO meta SELECT DISTINCT product from reviews;`
  // const oneQuery =
  // `UPDATE meta SET one=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=1);`
  // const twoQuery =
  // `UPDATE meta SET two=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=2);`
  // const threeQuery =
  // `UPDATE meta SET three=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=3);`
  // const fourQuery =
  // `UPDATE meta SET four=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=4);`
  // const fiveQuery =
  // `UPDATE meta SET five=(SELECT COUNT(*) FROM reviews WHERE product=meta.product_id AND rating=5);`
  // client.query(distinctQuery)
  //   .then(() => console.log(`Distinct products found...`))
  //   .then(() => client.query(oneQuery))
  //   .then(() => console.log('updated one star ratings for all products'))
  //   .then(() => client.query(twoQuery))
  //   .then(() => console.log('updated two star ratings for all products'))
  //   .then(() => client.query(threeQuery))
  //   .then(() => console.log('updated three star ratings for all products'))
  //   .then(() => client.query(fourQuery))
  //   .then(() => console.log('updated four star ratings for all products'))
  //   .then(() => client.query(fiveQuery))
  //   .then(() => console.log('updated five star ratings for all products'))
  //   .catch(err => console.error(err))

  // pool.end()
  //   .then(() => console.log('Finished database seeding. Pool ending.'));
  done();
});
