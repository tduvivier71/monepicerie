// Invoke 'strict' JavaScript mode
'use strict';

// Set the 'test' environment configuration object
module.exports = {
	db: 'mongodb://localhost/sirona-test',
	sessionSecret: 'testSessionSecret',
	facebook: {
		clientID: '1844385705796965',
		clientSecret: '487b6a214da0ce28362a3d5c09906a4c',
		callbackURL: 'http://localhost:9000/oauth/facebook/callback'
	},
	twitter: {
		clientID: 'Twitter Application ID',
		clientSecret: 'Twitter Application Secret',
		callbackURL: 'http://localhost:3000/oauth/twitter/callback'
	},
	google: {
		clientID: 'Google Application ID',
		clientSecret: 'Google Application Secret',
		callbackURL: 'http://localhost:3000/oauth/google/callback'
	}
};