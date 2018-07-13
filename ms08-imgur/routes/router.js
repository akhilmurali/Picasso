let express = require('express');
let router = express.Router();
let User = require('../models/userModel');

router.post('/signup', (req, res) => {
  
  let userData = {
    email: req.body.email,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password
  }

  User.create(userData, function (err, user) {
    if (err) res.json({ result: 'error', error: err });
    else {
      req.session.uid = user._id;
      return res.status(302).redirect('/home');
    }
  });
});

router.post('/signin', (req, res, next) => {
  let email = req.body.email;
  let pass = req.body.password;
  console.log(email, pass);
  User.authenticate(email, pass, function (err, user) {
    console.log('hi');
    if (err || !user) {
      var err = new Error('Wrong email or password.');
      err.status = 401;
      return next(err);
    } else {
      req.session.uid = user._id;
      return res.status(302).redirect('/home');
    }
  });

});


router.get('/home', (req, res, next) => {
  User.findById(req.session.uid)
    .exec(function (err, user) {
      if (error) {
        return next(err);
      } else if (user === null) {
        var error = new Error('User not authenticated');
        err.status = 400;
        return next(err);
      } else {
        return res.json({
          username: user.username,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname
        });
      }
    });
});

router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object:
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});


module.exports = router;
