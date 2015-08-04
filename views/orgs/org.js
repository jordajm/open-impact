'use strict';

exports.getOrgList = function(req, res, next){

  req.app.db.models.Org.find().exec(function(err, orgs) {
    if (err) {
      return res.send(err);
    }
    
    res.send(JSON.stringify(orgs));

  });
};

exports.getOrgData = function(req, res){
  var workflow = req.app.utility.workflow(req, res);
  var orgDataObj = {};
  
  workflow.on('getOrg', function() {
    req.app.db.models.Org.findOne({ orgLink: req.params.orgLink }, function (err, org) {
      if (err) {
        return res.send(500, err).end();
      }
      orgDataObj.orgData = org;
      workflow.emit('getOrgMetrics', org);
    });
  });
  
  workflow.on('getOrgMetrics', function(thisOrg) {
    req.app.db.models.Metric.find({'metricId': { $in: thisOrg.orgIrisMetricIds } }, function (err, metricsList) {
      if (err) {
        return res.send(500, err).end();
      }
      orgDataObj.trackedMetrics = metricsList;
      workflow.emit('getOrgReports', thisOrg);
    });
  });
  
  workflow.on('getOrgReports', function(thisOrg) {
    req.app.db.models.Report.find({'_id': { $in: thisOrg.orgImpactReportIds } }, function (err, reportList) {
      if (err) {
        return res.send(500, err).end();
      }
      orgDataObj.reports = reportList;
      res.send(JSON.stringify(orgDataObj));
    });
  });
  
  workflow.emit('getOrg');
  
};

exports.getOrgArray = function(req, res){
  var workflow = req.app.utility.workflow(req, res);
  var orgDataObj = {};
  
  workflow.on('getOrgs', function() {
    console.log('================= req.body = ', req.body);
    req.app.db.models.Org.find({ orgLink: { $in: req.body.form } }, function (err, orgs) {
      if (err) {
        return res.send(500, err).end();
      }
      orgDataObj.orgData = orgs;
      workflow.emit('getOrgMetrics', orgs);
    });
  });
  
  workflow.on('getOrgMetrics', function(orgs) {
    console.log('================= orgs = ', orgs);
    var orgsLen = orgs.length;
    for(var i = 0; i < orgsLen; i++){
      var thisOrg = orgs[i];
      req.app.db.models.Metric.find({'metricId': { $in: thisOrg.orgIrisMetricIds } }, function (err, metricsList) {
        if (err) {
          return res.send(500, err);
        }
        orgDataObj[i].trackedMetrics = metricsList;
        workflow.emit('getOrgReports', orgs);
      });
    }
  });
  
  workflow.on('getOrgReports', function(orgs) {
    var orgsLen = orgs.length;
    for(var i = 0; i < orgsLen; i++){
      var thisOrg = orgs[i];
      req.app.db.models.Report.find({'_id': { $in: thisOrg.orgImpactReportIds } }, function (err, reportList) {
        if (err) {
          return res.send(500, err);
        }
        orgDataObj[i].reports = reportList;
        if(i == (orgsLen - 1)){
          console.log('============= orgDataObj = ', orgDataObj);
          res.send(JSON.stringify(orgDataObj));
        }
      });
    }
  });
  
  workflow.emit('getOrgs');
  
};

exports.createOrg = function(req, res, next){
  // var ObjectID = require('mongodb').ObjectID,
  // newOrgId = new ObjectID(req.body.orgId);
  
  // Generate a random 7 character string with lowercase letters and numbers 0-9
  var newAPIKey = Math.random().toString(36).substr(2, 7);
  
  var fieldsToSet = {
    orgLink: req.body.orgLink,
    orgName: req.body.orgName,
    orgAPIKey: newAPIKey,
    orgType: req.body.orgType
  };
  req.app.db.models.Org.create(fieldsToSet, function(err) {
    if (err) {
      console.log('err: ', err);
      console.log('req.body = ', req.body);
      return res.send(500, err).end();
    }
    
    console.log('fields received from POST to /org/: ', req.body);
    res.send(200).end();
  });
  
};

exports.deleteOrg = function(req, res, next){

  req.app.db.models.Org.findByIdAndRemove(req.params.id, function(err, org) {
    if (err) {
      return res.send(500, err).end();
    }

    res.send(200).end();
  });
  
};