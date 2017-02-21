'use strict';
/*eslint no-process-env:0*/

import path from 'path';
import _ from 'lodash';

const all = {
    env: process.env.NODE_ENV,
    root: path.normalize(`${__dirname}/../../..`),
    browserSyncPort: process.env.BROWSER_SYNC_PORT || 3000,
    port: process.env.PORT || 9000,
    ip: process.env.IP || '0.0.0.0',
    secrets: {
        session: 'crush-match-secret'
    },
    mongo: {
        options: {
            db: {
                safe: true
            },
            server: {
                socketOptions: {
                    socketTimeoutMS: 30000,
                    connectTimeoutMS: 30000
                }
            }
        }
    },
    facebook: {
        clientID: process.env.FACEBOOK_ID || 'id',
        clientSecret: process.env.FACEBOOK_SECRET || 'secret',
        callbackURL: `${process.env.DOMAIN || ''}/auth/facebook/callback`
    }
};

module.exports = _.merge(
    all,
    require('./shared'),
    require(`./${process.env.NODE_ENV}.js`) || {});
