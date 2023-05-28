const { pool } = require('./poolConnection.js');

const reviewSchema =
  `CREATE TABLE IF NOT EXISTS reviews (
    review_id SERIAL PRIMARY KEY,
    product integer,
    rating integer,
    date varchar,
    summary varchar,
    body varchar,
    recommend varchar,
    reported varchar DEFAULT 'false',
    response varchar,
    reviewer_name varchar,
    helpfulness integer DEFAULT 0
  );`

const photoSchema =
  `CREATE TABLE IF NOT EXISTS photos (
    id SERIAL PRIMARY KEY,
    review_id integer,
    url varchar
  );`

const metaSchema =
  `CREATE TABLE IF NOT EXISTS meta (
    product_id integer PRIMARY KEY,
    "one" integer DEFAULT 0,
    "two" integer DEFAULT 0,
    "three" integer DEFAULT 0,
    "four" integer DEFAULT 0,
    "five" integer DEFAULT 0
  );`

const recommendedSchema =
  `CREATE TABLE IF NOT EXISTS recommended (
    product_id integer,
    "true" integer,
    "false" integer
  );`

const characteristicsSchema =
  `CREATE TABLE IF NOT EXISTS characteristics (
    product_id integer,
    name varchar,
    characteristic_id integer,
    review_id integer,
    value integer
  );`

const reviewsIdx =
  `CREATE INDEX idx_review_id ON reviews (product)`

const photosFK =
  `ALTER TABLE photos ADD FOREIGN KEY (review_id) REFERENCES reviews (review_id);`

// const characteristicsFK =
//   `ALTER TABLE characteristics ADD FOREIGN KEY (review_id) REFERENCES meta (review_id);`

const recommendedFK =
  `ALTER TABLE recommended ADD FOREIGN KEY (product_id) REFERENCES meta (product_id);`

pool.connect((err, client, done) => {
  if (err) {
    console.error('Error connecting to db ', err);
    return;
  }
  console.log('Connected to db successfully')

  client.query(reviewSchema, (err, result) => {
    if (err) {
      console.error('Error creating reviews table:', err);
    }
    console.log('Reviews table created or already exists.');
  });

  client.query(photoSchema, (err, result) => {
    if (err) {
      console.error('Error creating photo table:', err);
    }
    console.log('Photo table created or already exists.');
  });

  client.query(metaSchema, (err, result) => {
    if (err) {
      console.error('Error creating meta table:', err);
    }
    console.log('Meta table created or already exists.');
  });

  client.query(recommendedSchema, (err, result) => {
    if (err) {
      console.error('Error creating recommended table:', err);
    }
    console.log('Recomended table created or already exists.');
  });

  client.query(characteristicsSchema, (err, result) => {
    if (err) {
      console.error('Error creating characteristics table:', err);
    }
    console.log('Characteristics table created or already exists.');
  });

  client.query(photosFK, (err, result) => {
    if (err) {
      console.error('Error creating photos foreign key:', err);
    }
    console.log('Photos foreign key created');
  });

  // client.query(characteristicsFK, (err, result) => {
  //   if (err) {
  //     console.error('Error creating characteristics foreign key:', err);
  //   }
  //   console.log('Characteristics foreign key created');
  // });

  client.query(recommendedFK, (err, result) => {
    if (err) {
      console.error('Error creating recommended foreign key:', err);
    }
    console.log('Recommended foreign key created');
  });

  client.query(reviewsIdx, (err, result) => {
    if (err) {
      console.error('Error creating reviews index:', err);
    }
    console.log('Reviews index created');
  });
  // pool.end()
  //   .then(() => console.log('Finished database template. Pool ending.'));
  done();
});