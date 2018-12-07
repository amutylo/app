/**
 * Request handlers file.
 */

//Dependencies.
var _data = require('./data');
var helpers = require('./helpers');

//Define handlers
var handlers = {};

/**
 * Users handler
 */
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

/**
 * Users - GET method
 *
 * @data.phome required
 * @data.optional none
 * @TODO:: only for authenticated users to access their objects.
 */
handlers._users.get = function(data, callback) {
    // Check the phone is valid.
    var phone =
        typeof data.queryString.phone == 'string' &&
        data.queryString.phone.trim().length == 10
            ? data.queryString.phone.trim()
            : false;

    if (phone) {
        _data.read('users', phone, function(err, User) {
            if (!err) {
                // Remove the hashed password from User object
                delete User.hashedPassword;
                callback(200, User);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { Error: 'Required phone number was not provided.' });
    }
};

/**
 * Users - PUT method
 *
 * @data.phone required
 * @data.optional are firstName, lastName, password (one must exist)
 * @TODO:: User can update only their own data.
 */
handlers._users.put = function(data, callback) {
    // Check the phone is valid.
    var update = {};
    update.phone =
        typeof data.payload.phone == 'string' &&
        data.payload.phone.trim().length == 10
            ? data.payload.phone.trim()
            : false;

    // Check optional fields.

    update.firstName =
        typeof data.payload.firstName == 'string' &&
        data.payload.firstName.trim().length > 0
            ? data.payload.firstName.trim()
            : false;
    update.lastName =
        typeof data.payload.lastName === 'string' &&
        data.payload.lastName.trim().length > 0
            ? data.payload.lastName.trim()
            : false;
    update.password =
        typeof data.payload.password === 'string' &&
        data.payload.password.trim().length > 0
            ? data.payload.password.trim()
            : false;
    if (update.phone) {
        if (update.firstName || update.lastName || update.password) {
            // Lookup User if exists
            _data.read('users', update.phone, function(err, userData) {
                if (!err && userData) {
                    // Update user fields.
                    for (var field in userData) {
                        if (update[field]) {
                            userData = helpers.updateUserField(
                                update[field],
                                userData,
                                field
                            );
                        }
                    }

                    // Store updated userData;
                    _data.update('users', update.phone, userData, function(
                        err
                    ) {
                        if (!err) {
                            callback(200);
                        } else {
                            callback(500, {
                                Error: 'Could not update requested User'
                            });
                        }
                    });
                } else {
                    callback(400, { Error: 'Requested user does not exist' });
                }
            });
        } else {
            callback(400, { Error: 'Missing data to update' });
        }
    } else {
        callback(404, { Error: 'Missing phone as required field' });
    }
};

/**
 * Users - DELETE method
 *
 * @data.phone required
 * @TODO:: Authenticated user delete their own account.
 */
handlers._users.delete = function(data, callback) {
    // Check phone number is valid.
    var phone =
        typeof data.queryString.phone == 'string' &&
        data.queryString.phone.trim().length == 10
            ? data.queryString.phone.trim()
            : false;

    if (phone) {
        _data.read('users', phone, function(err, User) {
            if (!err) {
                _data.delete('users', phone, function(err) {
                    if (!err) {
                        callback(200);
                    } else {
                        callback(500, { Error: 'Could not delete the user.' });
                    }
                });
            } else {
                callback(400, { Error: 'Could not find requested User' });
            }
        });
    } else {
        callback(400, { Error: 'Required phone number was not provided.' });
    }
};

/**
 * Tokens handler
 */
handlers.tokens = function(data, callback) {
    var acceptableMethods = ['post', 'get', 'put', 'delete'];
    if (acceptableMethods.indexOf(data.method) !== -1) {
        var currentHandler = handlers._tokens[data.method];
        currentHandler(data, callback);
    } else {
        callback(405);
    }
};

handlers._tokens = {};

/**
 * Tokens POST method
 *
 * @data.phone - required
 * @data.password - required
 */
handlers._tokens.post = function(data, callback) {
    var phone =
        typeof data.payload.phone == 'string' &&
        data.payload.phone.trim().length == 10
            ? data.payload.phone.trim()
            : false;

    var password =
        typeof data.payload.password === 'string' &&
        data.payload.password.trim().length > 0
            ? data.payload.password.trim()
            : false;

    if (phone && password) {
        // Lookup User having same phone number.
        _data.read('users', phone, function(err, userData) {
            if (!err) {
                //Hash the send password, and compare passwords.
                var hashedPassword = helpers.hash(password);
                if (hashedPassword === userData.hashedPassword) {
                    // If the same, create token and set a 1 hour of time expiration.
                    var tokenId = helpers.createRandomString(20);
                    var expires = Date.now() + 1000 * 60 * 60;

                    if (tokenId) {
                        var tokenObj = {
                            phone: phone,
                            id: tokenId,
                            expires: expires
                        };

                        _data.create('tokens', tokenId, tokenObj, function(
                            err
                        ) {
                            if (!err) {
                                callback(200, tokenObj);
                            } else {
                                callback(400, {
                                    Error: 'Could not create a new token'
                                });
                            }
                        });
                    } else {
                        // Something wrong with helper lib function (It may return false.).
                        callback(400, { Error: 'Error creating tokenId.' });
                    }
                } else {
                    callback(400, { Error: 'Passwords did not match' });
                }
            } else {
                callback(400, {
                    Error: 'Could not found User having phone number: ' + phone
                });
            }
        });
    } else {
        callback(400, {
            Error: 'Missing required fields (either phone or password).'
        });
    }
};

/**
 * Tokens - GET method
 *
 * @data.id - required
 */
handlers._tokens.get = function(data, callback) {
    // Check the id is valid.
    var id =
        typeof data.queryString.id == 'string' &&
        data.queryString.id.trim().length == 20
            ? data.queryString.id.trim()
            : false;

    if (id) {
        _data.read('tokens', id, function(err, tokenData) {
            if (!err) {
                // Remove the hashed password from User object
                callback(200, tokenData);
            } else {
                callback(404);
            }
        });
    } else {
        callback(400, { Error: 'Required id was not provided.' });
    }
};
handlers._tokens.put = function() {};
handlers._tokens.delete = function() {};

handlers.ping = function(data, callback) {
    //callback http status code and
    callback(200);
};

//Not found handler;
handlers.notFound = function(data, callback) {
    callback(404);
};

module.exports = handlers;
