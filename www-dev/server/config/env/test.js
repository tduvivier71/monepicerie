'use strict';

// Set the 'development' environment configuration object
module.exports = {
    db: 'mongodb://127.0.0.1/monepicerie-test',
    sessionSecret: 'testSessionSecret',
    TOKEN_SECRET: 'thisIsTestSecret',
    FACEBOOK: {
        clientID: '1844382665797269',
        CLIENT_SECRET: '487b6a214da0ce28362a3d5c09906a4c'
    },
    GOOGLE: {
        clientID: 'Google Application ID',
        CLIENT_SECRET: 'oJFl-nV6f66kaT8tvZKbkFCO'
    }
};