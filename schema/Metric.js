'use strict';

exports = module.exports = function(app, mongoose) {
  var metricSchema = new mongoose.Schema({ 
    metricId: String,
    metricSection: String,
    metricSubsection: String,
    metricSector: String,
    metricName: String,
    definition: String,
    metricType: String,
    metricQuantityType: String,
    reportingFormat: String
  });
  
  app.db.model('Metric', metricSchema);
};