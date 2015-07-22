'use strict';

exports = module.exports = function(app, mongoose) {

    require('./schema/Metric')(app, mongoose);
    require('./schema/Org')(app, mongoose);
    require('./schema/Report')(app, mongoose);
    
};
