'use strict';

exports = module.exports = function(app, mongoose) {
  var orgSchema = new mongoose.Schema({ 
    orgName: String,
    orgLink: String,
    orgAPIKey: String,
    orgType: String,
    orgIrisMetricIds: [String],
    orgImpactReportIds: [String]
  });
  
  app.db.model('Org', orgSchema);
};