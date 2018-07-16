let express = require('express');
let router = express.Router();
let User = require('../models/userModel');
let Post = require('../models/postModel');

//Base route:
router.get('/', (req, res) => {
  Post.find({}, function (err, data) {
    if (err) res.json({ status: 'error', message: 'error recieving data from the database' });
    res.json({ status: 'ok', data });
  });
});

//Signup route:
router.post('/signup', (req, res) => {
  let userData = {
    email: req.body.email,
    username: req.body.username,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    password: req.body.password
  }

  User.create(userData).then(function (user) {
    req.session.uid = user._id;
    return res.status(302).redirect('/home');
  }, function (err) {
    res.json({ result: 'error', error: err });
  }).catch((err) => {
    res.json({ result: 'error', error: err });
  });

});

//Sign in route:
router.post('/signin', (req, res, next) => {
  let email = req.body.email;
  let pass = req.body.password;
  console.log(email, pass);
  User.authenticate(email, pass).then((user) => {
    //Promise Resolved:
    req.session.uid = user._id;
    res.status(302).redirect('/home');
  }, (err) => {
    //Promise Rejected:
    if (err.error) res.json({ status: 'invalid credentials' });
    res.status(500).redirect('/');
  }).catch((err) => {
    console.log('some error occured');
    res.status(500).redirect('/');
  });
});
//Route to redirect user to his/her homepage:
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

//Route to add a post to the website:
router.post('/addpost', (req, res, next) => {
  if (req.session.uid) {
    let postData = {
      uid: req.session.uid,
      url: req.body.url,
      likes: req.body.likes,
      tags: req.body.tags
    }
    Post.create(postData, function (err, post) {
      if (err) res.json({ status: 'error' });
      res.json({ status: 'ok', message: 'post saved successfully' });
    });
  } else {
    res.status(301).redirect('/');
  }
});

//Increment likes on a router:
router.put('/:id/likes', (req, res) => {
  let id = req.param.id;
  Post.update({ _id: id }, { $inc: { likes } });
});

router.delete('/:id/post', (req, res) => {
  let postId = req.params.id;
  let userId = req.body.uid;  //user id on the post
  if (req.session.uid == userId) {
    Post.deleteOne({ _id: id });
    res.json({ status: 'ok', message: 'Deleted post successfully' });
  } else {
    res.status(401).json({ status: 'error', message: "can't delete the message" });
  }
});

//Route to logout:
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
