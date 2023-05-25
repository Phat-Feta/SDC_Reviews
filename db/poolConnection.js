const { Pool } = require('pg');

const pool = new Pool({
  user: 'naru',
  host: 'localhost',
  database: 'sdc_reviews',
  password: 'postgres',
  post: 5432,
  idleTimeoutMillis: 0,
  connectionTimeoutMillis: 0
});

module.exports = { pool };