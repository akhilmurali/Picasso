let express = require('express');
let router = express.Router();
let User = require('../models/userModel');
let Post = require('../models/postModel');
let multer = require('multer');
let upload = multer({ dest: './uploads/' });
let path = require('path');
let fs = require('fs');

//Base route:
router.get('/', (req, res) => {
  res.send(req.sess.data);
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
router.post('/signin', (req, res) => {
  let email = req.body.email;
  let pass = req.body.password;
  User.authenticate(email, pass).then((user) => {
    //Promise Resolved:
    req.session.uid = user._id;
    res.status(302).redirect('/home');
  }).catch((err) => {
    console.log('some error occured');
    res.status(500).redirect('/');
  });
});

//Route to redirect user to his/her homepage:
router.get('/home', (req, res) => {
  User.findById(req.session.uid)
    .exec(function (err, user) {
      if (error) {
        return next(err);
      } else if (user === null) {
        var error = new Error('User not authenticated');
        err.status = 400;
        return res.json(err);
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

//Get route to add an image:
router.get('/addpost', (req, res) => {
  res.render('form');
});


//Route to add a post to the website:
router.post('/addpost', upload.single('image'), (req, res) => {
  console.log(req.file);
  console.log(path.resolve(__dirname, req.file.path));
  var bitmap = fs.readFileSync(req.file.path);
  var base64 = new Buffer(bitmap).toString('base64');
  if (req.session.uid) {
    let postData = {
      uid: req.session.uid || 'somerandomuid',
      b64: base64,
      mimetype: req.file.mimetype,
      likes: req.body.likes,
      tags: req.body.tags
    }
    Post.create(postData, function (err, post) {
      console.log(err);
      if (err) res.json({ status: 'error' });
      res.json({ status: 'ok', message: 'post saved successfully' });
    });
  } else {
    res.status(301).redirect('/');
  }
});

//This is a sample route only: Don't use it in production:
router.get('/getonepost', (req, res) => {
  Post.findOne({}, function (err, data) {
    res.render('sample', { url: `data:${data.mimetype};base64,${data.b64}` })
  });

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
router.get('/logout', function (req, res) {
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
