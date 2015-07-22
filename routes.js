'use strict';

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.set('X-Auth-Required', 'true');
  req.session.returnUrl = req.originalUrl;
  res.redirect('/login/');
}

function ensureAdmin(req, res, next) {
  if (req.user.canPlayRoleOf('admin')) {
    return next();
  }
  res.redirect('/');
}

function ensureAccount(req, res, next) {
  if (req.user.canPlayRoleOf('account')) {
    if (req.app.config.requireAccountVerification) {
      if (req.user.roles.account.isVerified !== 'yes' && !/^\/account\/verification\//.test(req.url)) {
        return res.redirect('/account/verification/');
      }
    }
    return next();
  }
  res.redirect('/');
}

exports = module.exports = function(app, passport) {
  
  //Base URL
  app.get('/', require('./views/index').init);
  
  //Metrics
  app.get('/metrics/', require('./views/metrics/metrics').getIrisMetrics);
  app.post('/metrics/', require('./views/metrics/metrics').addMetricToOrg);
  
  //Orgs
  app.get('/org/', require('./views/orgs/org').getOrgList);
  app.post('/org/', require('./views/orgs/org').createOrg);
  app.delete('/org/:id/', require('./views/orgs/org').deleteOrg);
  
  //Reports
  app.get('/reportList/:apiKey/', require('./views/reports/report').getOrgReportList);
  app.get('/report/:reportId/', require('./views/reports/report').getReport);
  app.post('/report/:apiKey/', require('./views/reports/report').createReport);
  app.delete('/report/:reportId/', require('./views/reports/report').deleteReport);
  
};
