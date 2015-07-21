'use strict';

exports = module.exports = function(app, mongoose) {

    require('./schema/Metric')(app, mongoose);

};
