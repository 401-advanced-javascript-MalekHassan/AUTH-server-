'use strict';
require('dotenv').config;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { mongo } = require('mongoose');
const secret = process.env.SECRET || 'mysecret';
const mongoDB = require('./model/users-model');
// const db = {};
let users = {}; //exporting

users.save = async function (record) {
  // console.log('aaaaaaaaaaaaaa', record.username);
  let reading = await mongoDB.read(record.username);
  // console.log('reading', !reading[0]);
  if (!reading[0]) {
    // console.log(record.password);
    record.password = await bcrypt.hash(record.password, 7);
    await mongoDB.create(record);
    return record;
  }
  // let addNewNote =await mongoDB.create(record);
  return Promise.reject();
};

// compare the password with the encrypted one
users.authenticateBasic = async function (username, password) {
  // let reading = await mongoDB.read(record.username);
  // console.log(password)
  // console.log(username)
  let reading = await mongoDB.read(username);
  // console.log(reading[0].password);
  // console.log('hello');
  let valid = await bcrypt.compare(password, reading[0].password);
  return valid ? username : Promise.reject();
};

users.generateToken = function (user) {
  let token = jwt.sign({ username: user.username }, secret,{expiresIn:15000,})
  // console.log('token', token);
  return token;
};

users.list = async function (record) {
  let reading = await mongoDB.read(record);

  return reading;
};

module.exports = users;
