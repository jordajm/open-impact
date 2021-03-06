'use strict';

//dependencies
var config = require('./config'),
    express = require('express'),
    fs = require('fs'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    http = require('http'),
    path = require('path'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    helmet = require('helmet'),
    csrf = require('csurf'),
    cors = require('cors');

//create express app
var app = express();

//keep reference to config
app.config = config;

//setup the web server
app.server = http.createServer(app);

//setup mongoose
app.db = mongoose.createConnection(config.mongodb.uri);
app.db.on('error', console.error.bind(console, 'mongoose connection error: '));
app.db.once('open', function () {
  //and... we have a data store
});

//config data models
require('./models')(app, mongoose);

//settings
// app.disable('x-powered-by');
app.set('port', config.port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//middleware
app.use(cors());
app.use(require('morgan')('dev'));
app.use(require('compression')());
app.use(require('serve-static')(path.join(__dirname, 'public')));
// app.use(require('method-override')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(config.cryptoKey));
// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: config.cryptoKey,
//   store: new mongoStore({ url: config.mongodb.uri })
// }));
// app.use(passport.initialize());
// app.use(passport.session());
// var csrfValue = function(req) {
//   var token = (req.body && req.body._csrf)
//     || (req.query && req.query._csrf)
//     || (req.headers['x-csrf-token'])
//     || (req.headers['x-xsrf-token']);
//   return token;
// };
// app.use(csrf({ value: csrfValue }));
// helmet(app);

//response locals
// app.use(function(req, res, next) {
//   res.cookie('XSRF-TOKEN', req.csrfToken());
//   res.locals.user = {};
//   res.locals.user.defaultReturnUrl = req.user && req.user.defaultReturnUrl();
//   res.locals.user.username = req.user && req.user.username;
//   next();
// });

//global locals
app.locals.projectName = app.config.projectName;
app.locals.copyrightYear = new Date().getFullYear();
app.locals.copyrightName = app.config.companyName;
app.locals.cacheBreaker = 'br34k-01';

//setup passport
// require('./passport')(app, passport);

//setup routes
require('./routes')(app, passport);

//setup utilities
app.utility = {};
app.utility.sendmail = require('./util/sendmail');
app.utility.slugify = require('./util/slugify');
app.utility.workflow = require('./util/workflow');


/*
=============================================================
To init a new DB, uncomment this code and run app.js one time.
This will load all Iris Metrics data into the DB from
allIrisMetrics.csv.
=============================================================
*/
// var metricsList = fs.readFileSync('allIrisMetrics.csv').toString().split('\r\n');
// // console.log(metricsList);

// var metricsArr = [];
// var metricsListLen = metricsList.length;
// for(var i = 0; i < metricsListLen; i++){
//   var thisMetric = metricsList[i].split(',');
//   metricsArr[i] = {
//     metricId: thisMetric[0],
//     metricSection: thisMetric[1],
//     metricSubsection: thisMetric[2],
//     metricSector: thisMetric[3],
//     metricName: thisMetric[4],
//     definition: thisMetric[5],
//     metricType: thisMetric[6],
//     metricQuantityType: thisMetric[7],
//     reportingFormat: thisMetric[8]
//   };
// }

// app.db.models.Metric.create(metricsArr, function(err) {
//   if (err) {
//     console.log("error importing Iris Metric. err = ", err);
//   }
// });
/*
=============================================================
End: Iris Metrics init code.
=============================================================
*/

//listen up
app.server.listen(app.config.port, function(){
  //and... we're live
});
