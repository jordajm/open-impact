'use strict';

exports.getIrisMetrics = function(req, res, next){

  req.app.db.models.Metric.find().exec(function(err, metrics) {
    if (err) {
      return res.send(500, err).end();
    }
    
    res.send(JSON.stringify(metrics));

  });
};

exports.addMetricToOrg = function(req, res, next){
  var ObjectID = require('mongodb').ObjectID;

  var orgQuery = { orgAPIKey: req.body.orgAPIKey };
  var orgUpdate = { $push: { orgIrisMetricIds: new ObjectID(req.body.metricId) } };
  var orgOptions = {};
  req.app.db.models.Org.findOneAndUpdate(orgQuery, orgUpdate, orgOptions, function(err) {
    if (err) {
      return res.send(500, err).end();
    }
    res.send(200).end();
  });
  
};