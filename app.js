var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

const port=process.env.PORT||3000;
//connect to MongoDB
mongoose.connect('mongodb://ipuresult:Karma_321@cluster0-shard-00-00-ha2bp.mongodb.net:27017,cluster0-shard-00-01-ha2bp.mongodb.net:27017/logintest,cluster0-shard-00-02-ha2bp.mongodb.net:27017/admin?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

var db = mongoose.connection;


//handle mongo error
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected!
});

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// parse incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// serve static files from template
//app.use(express.static(__dirname + '/templateLogReg'));

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
  res.send(err.message);
});


// listen on port 3000
app.listen(port, function () {
  console.log('Express app listening on port 3000');
});