/**
 * Create and export configuration variables;
 */

//Container for all the invironments

var environments = {};

// Staging (default) environment

environments.staging = {
    httpPort: 3000,
    httpsPort: 3001,
    envName: 'staging',
    hashingSecret: 'thisIsASicret',
    maxChecks: 5,
    twilio: {
        accountSid: 'AC3b908ba095c3af5ab45edf632c52128d',
        authToken: '53929340264141b8295543aabdadf2e3',
        fromPhone: '5625266114'
    }
};

environments.production = {
    httpPort: 5000,
    httpsPort: 5001,
    envName: 'production',
    hashingSecret: 'thisIsASicret',
    maxChecks: 5,
    twilio: {
        accountSid: 'AC3b908ba095c3af5ab45edf632c52128d',
        authToken: '53929340264141b8295543aabdadf2e3',
        fromPhone: '5625266114'
    }
};

// Determine which environment should be exported
var currentEnvironment =
    typeof process.env.NODE_ENV === 'string'
        ? process.env.NODE_ENV.toLowerCase()
        : '';

//  Check that the current environment is one of the above, if not default to staging
var environmentToExport =
    typeof environments[currentEnvironment] === 'object'
        ? environments[currentEnvironment]
        : environments.staging;

//Export the module

module.exports = environmentToExport;
