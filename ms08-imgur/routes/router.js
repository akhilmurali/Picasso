let express = require('express');
let router = express.Router();
let User = require('../models/userModel');
// GET /
router.get('/', function(req, res, next) {
  return res.json({status: 'ok'});
});

router.post('/signin', (req, res)=>{

});


router.post('/signup', (req, res)=>{
    console.log('hi');
    console.log(req.body.email);
    let userData = {
      email: req.body.email,
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: req.body.password
    }
    User.create(userData, function(err, user){
      if(err) res.json({result: 'error', error: err});
      res.json({result: 'ok'});
    });
});

module.exports = router;
