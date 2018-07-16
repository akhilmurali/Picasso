let express = require('express');
let app = express();
let bodyParser = require('body-parser');
let session = require('express-session');
require('dotenv').config();
let mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.use(session({
  secret: process.env.secret
}));

// serve static files from /public:
app.use(express.static(__dirname + '/public'));

// Include routes:
var routes = require('./routes/router');
app.use('/', routes);

// catch 404 and forward to error handler:
app.get('*', function (req, res, next) {
  var err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next){
  //Custom error handler:
  //Render a neat error file here:
  console.log(err);
  res.json(err);
});

// listen on port 3000:
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb://${process.env.uname}:${process.env.pass}@ds135421.mlab.com:35421/imgur_macrocozm`,
  { useNewUrlParser: true })
  .then(() => {
    console.log('mongodb connected');
    app.listen(3000, () => {
      console.log('Express app listening on port 3000');
    });
  }, () => { console.log('Connection error to mongo db'); })
  .catch((err) => { console.log(err); });



  