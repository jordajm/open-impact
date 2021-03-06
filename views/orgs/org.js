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
    if(thisOrg){
      req.app.db.models.Metric.find({'metricId': { $in: thisOrg.orgIrisMetricIds } }, function (err, metricsList) {
        if (err) {
          return res.send(500, err).end();
        }
        orgDataObj.trackedMetrics = metricsList;
        workflow.emit('getOrgReports', thisOrg);
      });
    }else{
      res.send(500, 'Missing parameters').end();
    }
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
  var async = require('async');
  var orgDataArr = [],
      metricsArr = [],
      reportsArr = []; 
  
  workflow.on('parseRequest', function(){
    // TODO - use Async library instead of vanilla JS with a stupid setTimeout:
    // converting obj to array:
    var obj = req.body;
    var orgLinksArr = Object.keys(obj).map(function(k) { return obj[k] });
    
    setTimeout(function(){
      workflow.emit('getOrgs', orgLinksArr);
    },0);
  });
  
  workflow.on('getOrgs', function(orgLinksArr) {
    req.app.db.models.Org.find({ orgLink: { $in: orgLinksArr } }, function (err, orgs) {
      if (err) {
        return res.send(500, err).end();
      }
      orgDataArr.push.apply(orgDataArr, orgs);
      workflow.emit('getOrgMetrics', orgs);
    });
  });
  
  workflow.on('getOrgMetrics', function(orgs) {
      async.each(orgs, function(org, callback) {
        
        var thisOrgMetricIds = org.orgIrisMetricIds;
        req.app.db.models.Metric.find({'metricId': { $in: thisOrgMetricIds } }, function (err, metricsList) {
          if (err) {
            return res.send(500, err).end();
          }
          metricsArr.push(metricsList);
          callback();
        });
      
      }, function(err){
          if( err ) {
            return res.send(500, err).end();
          } else {
            workflow.emit('getOrgReports', orgs);
          }
      });
  });
  
  workflow.on('getOrgReports', function(orgs) {
    async.each(orgs, function(org, callback) {
        
        var thisOrgReportIds = org.orgImpactReportIds;
        req.app.db.models.Report.find({ _id: { $in: thisOrgReportIds } }, function (err, reportsList) {
          if (err) {
            return res.send(500, err).end();
          }
          reportsArr.push(reportsList);
          callback();
        });
      
      }, function(err){
          if( err ) {
            return res.send(500, err).end();
          } else {
            workflow.emit('buildOrgDataObj');
          }
      });
  });
  
  workflow.on('buildOrgDataObj', function(){
    var finalOrgArr = [];
    var orgDataArrLen = orgDataArr.length;
    for(var i = 0; i < orgDataArrLen; i++){
      var thisOrg = {
        orgData: orgDataArr[i],
        trackedMetrics: metricsArr[i],
        reports: reportsArr[i]
      };
      finalOrgArr.push(thisOrg);
      if(i == (orgDataArrLen - 1)){
        res.send(JSON.stringify(finalOrgArr));
      }
    }
  });
  
  workflow.emit('parseRequest');
  
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