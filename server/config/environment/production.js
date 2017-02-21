'use strict';
/*eslint no-process-env:0*/

module.exports = {
    ip: process.env.OPENSHIFT_NODEJS_IP
    || process.env.ip
    || undefined,

    port: process.env.OPENSHIFT_NODEJS_PORT
    || process.env.PORT
    || 8080,

    mongo: {
        uri: process.env.MONGODB_URI
        || process.env.MONGOHQ_URL
        || process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME
        || 'mongodb://localhost/crushmatch'
    }
};
