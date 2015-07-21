'use strict';

exports = module.exports = function(app, mongoose) {
  var metricSchema = new mongoose.Schema({ 
    metricId: String,
    metricSection: String,
    metricSubsection: String,
    metricSector: String,
    metricName: String,
    definition: String,
    // calculation: String,
    // usageGuidance: String,
    // citation: String,
    metricType: String,
    // relatedMetrics: String,
    // metricLevel: String,
    metricQuantityType: String,
    reportingFormat: String
  });
  
  app.db.model('Metric', metricSchema);
};