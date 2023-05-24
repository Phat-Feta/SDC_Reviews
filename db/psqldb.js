const { Pool } = require('pg');

const pool = new Pool({
  user: 'naru',
  host: 'localhost',
  database: 'sdc_reviews',
  password: 'postgres',
  post: 5432
});

const reviewSchema =
  `CREATE TABLE IF NOT EXISTS reviews (
    review_id integer PRIMARY KEY,
    product_id integer,
    rating integer,
    "date" timestamp,
    summary varchar,
    body varchar,
    recommend bit,
    reported bit,
    response varchar,
    reviewer_name varchar,
    reviewer_email varchar,
    helpfulness integer
  );`

const photoSchema =
  `CREATE TABLE IF NOT EXISTS photos (
    id integer PRIMARY KEY,
    review_id integer,
    url varchar
  );`

const metaSchema =
  `CREATE TABLE IF NOT EXISTS meta (
    product_id integer PRIMARY KEY,
    "1" integer,
    "2" integer,
    "3" integer,
    "4" integer,
    "5" integer
  );`

const recommendedSchema =
  `CREATE TABLE IF NOT EXISTS recommended (
    product_id integer,
    "true" integer,
    "false" integer
  );`

const characteristicsSchema =
  `CREATE TABLE IF NOT EXISTS characteristics (
    id integer PRIMARY KEY,
    product_id integer,
    name varchar,
    value integer
  );`

const photosFK =
  `ALTER TABLE photos ADD FOREIGN KEY (review_id) REFERENCES reviews (review_id);`

const characteristicsFK =
  `ALTER TABLE characteristics ADD FOREIGN KEY (product_id) REFERENCES meta (product_id);`

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

  client.query(characteristicsFK, (err, result) => {
    if (err) {
      console.error('Error creating characteristics foreign key:', err);
    }
    console.log('Characteristics foreign key created');
  });

  client.query(recommendedFK, (err, result) => {
    if (err) {
      console.error('Error creating recommended foreign key:', err);
    }
    console.log('Recommended foreign key created');
  });

  done();
});

module.exports = { pool };