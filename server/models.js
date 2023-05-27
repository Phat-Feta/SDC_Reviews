const { pool } = require('../db//poolConnection.js')

const get = (query) => {
  return pool.query(query)
}

const post = (query) => {
  return pool.query(query)
}

module.exports = { get, post }