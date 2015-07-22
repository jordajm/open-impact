'use strict';

exports = module.exports = function(app, mongoose) {
  var reportSchema = new mongoose.Schema({ 
    reportDate: { type : Date, default: Date.now },
    metricsData: [{
      _id: String,
      metricValue: String,
      note: String
    }]
  });
  
  app.db.model('Report', reportSchema);
};