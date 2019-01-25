/*
 * Helpers for various tasks
 *
 */

// Dependencies
var crypto = require('crypto');
var config = require('./config');
var https = require('https');
var querystring = require('querystring');

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
helpers.updateObjectField = function(value, obj, field) {
    switch (field) {
    case 'hashedPassword':
        obj[field] = this.hash(update);
        break;
    default:
        obj[field] = value;
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

// Send SMS message via Twillio.
helpers.sendTwillioSms = function(phone, msg, callback) {
    //validate params.
    phone =
        typeof phone == 'string' && phone.trim().length == 10
            ? phone.trim()
            : false;
    msg =
        typeof msg == 'string' &&
        msg.trim().length > 0 &&
        msg.trim().length <= 1600
            ? msg.trim()
            : false;
    if (phone && msg) {
        //Configure request payload to be send to Twillio;
        var payload = {
            From: config.twilio.fromPhone,
            To: '+1' + phone,
            Body: msg
        };

        //Sringify payload and
        var stringPayload = querystring.stringify();

        //Configure the request details.
        var requestDetails = {
            protocol: 'https:',
            hostname: 'api.twilio.com',
            method: 'POST',
            path:
                '/2010-04-01/Accounts/' +
                config.twilio.accountSid +
                '/Messages.json',
            auth: config.twilio.accountSid + ':' + config.twilio.authToken,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(stringPayload)
            }
        };

        //Instantiate a request object.
        var req = https.request(requestDetails, function(res) {
            //Grab status of the send request
            var status = res.statusCode;

            //Callback succesfully if request went through
            if (status == 200 || status == 201) {
                callback(false);
            } else {
                callback('Status code returned was ' + status);
            }
        });

        // Bind to the error event so it doesn't get thrown
        req.on('error', function(e) {
            callback(e);
        });

        // Add payload
        req.write(stringPayload);

        // End request.
        req.end();
    } else {
        callback('Given params missing or invalid.');
    }
};
module.exports = helpers;
