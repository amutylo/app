/*
 * Helpers for various tasks
 *
 */

// Dependencies
var crypto = require('crypto');
var config = require('./config');

// Container
var helpers = {};

// Parse JSON string to an object in all cases without throwing an error
helpers.parseJsonToObject = function(str) {
    if (typeof str === 'string' && str.length) {
        try {
            var obj = JSON.parse(str);
            return obj;
        } catch (error) {
            console.log('Error parsing string to JSON as of: ', error);
            return {};
        }
    } else {
        console.log('Could not parse empty string.');
        return {};
    }
};

// Create a SHA256 hash
helpers.hash = function(password) {
    if (typeof password === 'string' && password.length > 0) {
        var hash = crypto
            .createHmac('sha256', config.hashingSecret)
            .update(password)
            .digest('hex');
        return hash;
    } else {
        return false;
    }
};

module.exports = helpers;
