'use strict';
require('dotenv').config;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const { mongo } = require('mongoose');
const secret = process.env.SECRET || 'mysecret';
const mongoDB = require('./model/users-model');
// const db = {};
let users = {}; //exporting

let roles = {
  user: ['read'],
  writers: ['read', 'create'],
  editor: ['read', 'update', 'create'],
  admin: ['read', 'update', 'create', 'delete'],
};

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

users.generateTokenUp = function (user) {
  // ,{expiresIn:900}
  console.log('user >>>>>>>>>', user);
  console.log('roles >>>>>>>>>>', roles[user.role]);
  let token = jwt.sign(
    { username: user.username, capabilities: roles[user.role] },
    secret,
    { expiresIn: 900 }
  );
  console.log('tooken >>>>>>>>>>>', token);
  return token;
};

users.generateTokenIn = async function (user) {
  let reading = await mongoDB.read(user);
  console.log('generate token >>>>>>>>>', reading[0].role);
  let username = user;
  let capabilities = roles[reading[0].role] || user.role;
  // ,{expiresIn:900}
  let token = await jwt.sign(
    { username: username, capabilities: capabilities },
    secret,
    { expiresIn: 900 }
  );
  console.log(token);
  return token;
};
users.list = async function (record) {
  let reading = await mongoDB.read(record);

  return reading;
};

users.verifyToken = function (token) {
  console.log('Token >>>>>>>>>>>>>>>>', token);
  return jwt.verify(token, secret, async function (err, decoded) {
    if (err) {
      console.log('err>>> ', err);
      return Promise.reject(err);
    }

    // console.log('decoded >>>> ',decoded); // {username: usernameValue, ...}
    // console.log('decoded >>>> ',decoded.username); // {username: usernameValue, ...}
    // let username = decoded['username']; // decoded.username
    // console.log('username >>>>>>>>>>>>>>>>>>>>>>>',username);

    let username = decoded.username.username; // decoded.username
    // console.log('@@@@@@@@@@@sdfdsfdsafafs@@@@@@@@@',username);
    console.log('decoded >>>> ', username); // {username: usernameValue, ...}

    let reading = await mongoDB.read(username);
    console.log('');
    console.log(reading);
    if (reading[0]) {
      return Promise.resolve(decoded);
    }
    return Promise.reject();
  });
};

module.exports = users;
