'use strict';

exports = module.exports = function(app, mongoose) {
  var reportSchema = new mongoose.Schema({ 
    timestamp: Number,  // Saving as milliseconds to make sorting by timestamp on the front end easier
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