const knex = require('knex');
const env = process.env.DB_ENV || "development"
const knexConfig = require('../knexfile');

module.exports = knex(knexConfig[env]);