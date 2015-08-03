'use strict';

exports = module.exports = function(app, mongoose) {
  var reportSchema = new mongoose.Schema({ 
    timestamp: { type : Date, default: Date.now },
    metricsData: [{
      metricId: String,
      metricName: String,
      reportedValue: String,
    }],
    reportTimeframe: String,
    reportYear: String,
    content: String
  });
  
  app.db.model('Report', reportSchema);
};