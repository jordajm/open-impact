'use strict';

exports.getOrgReportList = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);
  
  workflow.on('getOrg', function(){
    req.app.db.models.Org.findOne({ orgAPIKey : req.params.apiKey }, function(err, org) {
      if (err) {
        return res.send(500, err).end();
      }
      workflow.emit('getReports', org);
    });
  });
  
  workflow.on('getReports', function(org){
    req.app.db.models.Report.find({'_id': { $in: org.orgImpactReportIds } }, function (err, reportList) {
      if (err) {
        return res.send(500, err);
      }
      res.send(JSON.stringify(reportList));
    });
  });
    
  workflow.emit('getOrg');
};

exports.getReport = function(req, res, next){

  req.app.db.models.Report.findOne({ _id: req.params.reportId }, function (err, report) {
    if (err) {
      return res.send(500, err);
    }
    res.send(JSON.stringify(report));
  });

};

exports.createReport = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);
  var ObjectID = require('mongodb').ObjectID;
  var newReportId = new ObjectID();
  
  workflow.on('createReport', function(){
    
    var fieldsToSet = {
      _id: newReportId,
      metricsData: req.body.metricsData,
      reportTimeframe: req.body.timeframe,
      reportYear: req.body.year
    };
    req.app.db.models.Report.create(fieldsToSet, function(err) {
      if (err) {
        return res.send(500, err).end();
      }
      workflow.emit('addReportToOrg');
    });
  });
  
  workflow.on('addReportToOrg', function(){

    var orgQuery = { orgLink: req.body.orgLink };
    var orgUpdate = { $push: { orgImpactReportIds: newReportId } };
    var orgOptions = {};
    req.app.db.models.Org.findOneAndUpdate(orgQuery, orgUpdate, orgOptions, function(err) {
      if (err) {
        return res.send(500, err).end();
      }
      res.send(200).end();
    });
  });
  
  workflow.emit('createReport');
  
};

exports.deleteReport = function(req, res, next){
  var workflow = req.app.utility.workflow(req, res);
  
  workflow.on('deleteReport', function() {
    req.app.db.models.Report.findByIdAndRemove(req.params.reportId, function(err, report) {
      if (err) {
        return res.send(500, err).end();
      }
      workflow.emit('removeReportFromOrgs');
    });
  });
  
  workflow.on('removeReportFromOrgs', function() {
    var orgQuery = {};
    var orgUpdate = { $pull: { 'orgImpactReportIds': req.params.reportId } };
    var orgOptions = { multi : true };
    req.app.db.models.Org.update(orgQuery, orgUpdate, orgOptions, function(err) {
      if (err) {
        return workflow.emit('exception', err);
      }
      res.send(200).end();
    });
  });
  
  workflow.emit('deleteReport');
  
};