'use strict';

const express = require('express');
const router = express.Router();
const users = require('./users');
const basicAuth = require('./middleware/basic-auth-middleware');
const oath = require('./middleware/oauth');
const bearerMiddleware = require('./middleware/bearerMiddleware');
// const app = express();
// app.use(express.json());

router.post('/signup', signup);
router.post('/signin', basicAuth, signin);
router.get('/users', list);
router.get('/secret', bearerMiddleware, secretFunction);

function secretFunction(req, res) {
  res.json(req.user);
}

router.get('/oauth', oath, (req, res) => {
  res.status(200).send(req.token);
});
function signup(req, res) {
  // console.log(req.body, 'aakkaka');
  //sign up route if we have the user, return failure, else return generated token.
  let user = req.body;
  // console.log(user);
  users
    .save(user)
    .then((result) => {
      // console.log(result);
      // generate a token and return it.
      let token = users.generateToken(result);
      res.status(200).send(token);
    })
    .catch((err) => {
      console.log('ERR!!>>>>>>>>', err);
      res.status(403).send('Invalid Signup! email is taken');
    });
}

function signin(req, res) {
  // console.log(req);
  res.status(200).send(req.token); // return token 4
}
function list(req, res) {
  users
    .list(undefined)
    .then((result) => {
      // console.log('prove of life');
      // console.log(result);
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log('ERR!!', err);
      res.status(403).send('Listing error');
    });
}
module.exports = router;
