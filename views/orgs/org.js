'use strict';

exports.getOrgList = function(req, res, next){

  req.app.db.models.Org.find().exec(function(err, orgs) {
    if (err) {
      return res.send(err);
    }
    
    res.send(JSON.stringify(orgs));

  });
};

exports.createOrg = function(req, res, next){
  // var ObjectID = require('mongodb').ObjectID,
  // newOrgId = new ObjectID(req.body.orgId);
  
  // Generate a random 7 character string with lowercase letters and numbers 0-9
  var newAPIKey = Math.random().toString(36).substr(2, 24);
  
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