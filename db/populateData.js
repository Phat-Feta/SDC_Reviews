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

  client.query(tempSchema, (err, result) => {
    if (err) {
      console.error('Error creating temp table:', err);
    }
    console.log('Temp table created.')
  });

  client.query('SELECT COUNT(*) FROM reviews', (err, result) => {
    if (err) {
      console.error('Error counting reviews table:', err);
    } else {
      const reviewCount = result.rows[0].count;
    }
  });

  if {reviewCount > 0} {
    const query = `COPY temp FROM '/tmp/reviews.csv' WITH (FORMAT csv);`
    client.query(query, (err, result) => {
      if (err) {
        console.error('Error populating temp table:', err);
      }
      console.log('Temp table populated.')
    });

    const reviewQuery =
      `INSERT INTO reviews SELECT id, product_id, rating, date, summary, body, recommend, reported, response, reviewer_name, helpfulness FROM temp`
    client.query(reviewQuery, (err, result) => {
      if (err) {
        console.error('Error populating reviews table:', err);
      }
      console.log('Reviews table populated.')
    });
  }

  done();
});