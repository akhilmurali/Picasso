let express = require('express');
let app = express();
let bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

require('dotenv').config();
let mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.uname}:${process.env.pass}@ds135421.mlab.com:35421/imgur_macrocozm`,
  { useNewUrlParser: true })
  .then(() => { console.log('mongodb connected') }, () => { console.log('Connection error to mongo db'); })
  .catch((err) => { console.log(err); });

// serve static files from /public:
app.use(express.static(__dirname + '/public'));

// include routes
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json('error', {
    message: err.message,
    error: {}
  });
});

// listen on port 3000
app.listen(3000, function () {
  console.log('Express app listening on port 3000');
});
