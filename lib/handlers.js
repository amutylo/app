/**
 * Request handlers file.
 */

//Dependencies.
var _data = require('./data');
var helpers = require('./helpers');

//Define handlers
var handlers = {};

//Users handler
handlers.users = function(data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) !== -1) {
        var currentHandler = handlers._users[data.method];
        currentHandler(data, callback);
    } else {
        callback(405);
    }
};

//C ontainer for users subhandlers
handlers._users = {};

/**
 * Users POST method
 * @var data.payload array : firstName, lastName, phone, password, tosAgreement
 * optional data: none
 */
handlers._users.post = function(data, callback) {
    // check required fields in data

    var firstName =
        typeof data.payload.firstName == 'string' &&
        data.payload.firstName.trim().length > 0
            ? data.payload.firstName.trim()
            : false;
    var lastName =
        typeof data.payload.lastName === 'string' &&
        data.payload.lastName.trim().length > 0
            ? data.payload.lastName.trim()
            : false;
    var phone =
        typeof data.payload.phone === 'string' &&
        data.payload.phone.trim().length == 10
            ? data.payload.phone.trim()
            : false;
    var password =
        typeof data.payload.password === 'string' &&
        data.payload.password.trim().length > 0
            ? data.payload.password.trim()
            : false;
    var tosAgreement =
        typeof data.payload.tosAgreement === 'boolean' &&
        data.payload.tosAgreement === true
            ? true
            : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // Check if user already exists
        _data.read('users', phone, function(err, data) {
            if (err) {
                console.log('pass', password);
                // Hash the password.
                var hashedPassword = helpers.hash(password);
                if (hashedPassword) {
                    //  Create a User obj
                    var userObj = {
                        firstName: firstName,
                        lastName: lastName,
                        phone: phone,
                        hashedPassword: hashedPassword,
                        tosAgreement: true
                    };
                    // Store user
                    _data.create('users', phone, userObj, function(err, data) {
                        if (!err) {
                            callback(200);
                        } else {
                            console.log(err);
                            callback(500, { Error: 'Could not create a user' });
                        }
                    });
                } else {
                    callback(500, {
                        Error: 'Could not hash provided password '
                    });
                }
            } else {
                // User exists
                callback(400, {
                    Error: 'User with the same phone number exists'
                });
            }
        });
    } else {
        callback(400, { Error: 'Missing required fields' });
    }
};

handlers._users.get = function(data, callback) {};

handlers._users.put = function(data, callback) {};

handlers._users.delete = function(data, callback) {};

handlers.hello = function(data, callback) {
    callback(200, { message: 'Welcome from Hello route!' });
};

handlers.ping = function(data, callback) {
    //callback http status code and
    callback(200);
};

//Not found handler;
handlers.notFound = function(data, callback) {
    callback(404);
};

module.exports = handlers;
