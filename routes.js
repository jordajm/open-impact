'use strict';

exports = module.exports = function(app, passport) {
  
  //Base URL
  app.get('/', require('./views/index').init);
  
  //Metrics
  app.get('/metrics/', require('./views/metrics/metrics').getIrisMetrics);
  app.post('/metrics/', require('./views/metrics/metrics').addMetricToOrg);
  app.post('/metrics/remove/', require('./views/metrics/metrics').removeMetricFromOrg);
  
  //Orgs
  app.get('/org/', require('./views/orgs/org').getOrgList);
  app.get('/org/:orgLink/', require('./views/orgs/org').getOrgData);
  app.put('/org/', require('./views/orgs/org').getOrgArray);
  app.post('/org/', require('./views/orgs/org').createOrg);
  app.delete('/org/:id/', require('./views/orgs/org').deleteOrg);
  
  //Reports
  app.get('/report/:reportId/', require('./views/reports/report').getReport);
  app.get('/reportList/:apiKey/', require('./views/reports/report').getOrgReportList);
  app.post('/report/', require('./views/reports/report').createReport);
  app.post('/report/update/', require('./views/reports/report').updateReport);
  app.delete('/report/:reportId/', require('./views/reports/report').deleteReport);
  
};
