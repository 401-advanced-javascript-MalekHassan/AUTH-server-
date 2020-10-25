'use strict';

const Model = require('./model');
const schema = require('./users-schema');

class Users extends Model {
  constructor(schema) {
    super(schema);
  }
}

module.exports = new Users(schema);
