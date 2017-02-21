'use strict';
/*eslint no-process-env:0*/

module.exports = {
    mongo: {
        uri: 'mongodb://localhost/crushmatch-test'
    },
    sequelize: {
        uri: 'sqlite://',
        options: {
            logging: false,
            storage: 'test.sqlite',
            define: {
                timestamps: false
            }
        }
    }
};
