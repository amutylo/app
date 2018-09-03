/**
 * Create and export configuration variables;
 */

 //Container for all the invironments

 var environments = {};

// Staging (default) environment

environments.staging = {
  'port': 3000,
  'envName': 'staging'
}

environments.production = {
  'port': 5000,
  'envName': 'production'
};

// Determine which environment should be exported
var currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//  Check that the current environment is one of the above, if not default to staging
var environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

//Export the module

module.exports = environmentToExport;

