'use strict';

const users = require('../users');
module.exports = (req, res, next) => {
  console.log('jjaja', req.headers, 'jaajajaja');
  if (!req.headers.authorization) {
    next('Invalid Login');
  } else {
    const token = req.headers.authorization.split(' ').pop();
    console.log('__TOKEN__', token);
    users
      .authenticateToken(token)
      .then((validUser) => {
        req.user = validUser;
        next();
      })
      .catch(() => {
        next('Invalid Login');
      });
  }
};
