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
            console.log('Error parsing string to JSON ', error);
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

/**
 * Update userObject helper.
 */
helpers.updateUserField = function(value, userObject, field) {
    switch (field) {
    case 'hashedPassword':
        userObject[field] = this.hash(update);
        break;
    default:
        userObject[field] = value;
        break;
    }
    return userObject;
};

/**
 * Create random string of the given length.
 */
helpers.createRandomString = function(strLength) {
    strLength =
        typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (strLength) {
        //Define all possible characters goes to string.
        var posChar = 'abcdefjhijklmnopqrstuvwxyz0123456789';

        //Start the final string.
        var str = '';
        for (var i = 1; i <= strLength; i++) {
            // Get random caracter from posCahr
            var randChar = posChar.charAt(
                Math.floor(Math.random() * posChar.length)
            );
            str += randChar;
        }
        return str;
    } else {
        return false;
    }
};

helpers.getToken = function(data) {
    return typeof data.headers.token === 'string' ? data.headers.token : false;
};

module.exports = helpers;
