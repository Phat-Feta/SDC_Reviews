const { pool } = require('../db//poolConnection.js')

const get = (query) => {
  return pool.query(query)
}


module.exports = { get }