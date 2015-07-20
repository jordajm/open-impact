'use strict';

exports.port = process.env.PORT || 8080;
exports.mongodb = {
  uri: process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'localhost/openimpactdb'
};
exports.companyName = 'Impact Trader, Inc.';
exports.projectName = 'Impact Trader';
exports.systemEmail = 'support@impacttrader.com';
exports.cryptoKey = 'k3yb0ardc4t';
exports.loginAttempts = {
  forIp: 50,
  forIpAndUser: 7,
  logExpiration: '20m'
};
exports.requireAccountVerification = false;
exports.smtp = {
  from: {
    name: process.env.SMTP_FROM_NAME || exports.projectName +' Support',
    address: process.env.SMTP_FROM_ADDRESS || 'support@impacttrader.com'
  },
  credentials: {
    user: process.env.SMTP_USERNAME || 'jordajm',
    password: process.env.SMTP_PASSWORD || 'dD7g$d8#',
    host: process.env.SMTP_HOST || 'smtp.sendgrid.net',
    tls: true
  }
};
exports.oauth = {
  twitter: {
    key: process.env.TWITTER_OAUTH_KEY || '',
    secret: process.env.TWITTER_OAUTH_SECRET || ''
  },
  facebook: {
    key: process.env.FACEBOOK_OAUTH_KEY || '',
    secret: process.env.FACEBOOK_OAUTH_SECRET || ''
  },
  github: {
    key: process.env.GITHUB_OAUTH_KEY || '',
    secret: process.env.GITHUB_OAUTH_SECRET || ''
  },
  google: {
    key: process.env.GOOGLE_OAUTH_KEY || '',
    secret: process.env.GOOGLE_OAUTH_SECRET || ''
  },
  tumblr: {
    key: process.env.TUMBLR_OAUTH_KEY || '',
    secret: process.env.TUMBLR_OAUTH_SECRET || ''
  }
};
