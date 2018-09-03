/**
 * Primary file for API.
 */

// Dependencies
var http = require('http');
var url = require('url');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

// The server should respond to all requests with a string
var server = http.createServer(function (req, res) {
  // get url and parse it;
  var parsedUrl = url.parse(req.url, true);

  //get the path from url;
  var path = parsedUrl.pathname;
  // trim all slashes from both sides of the path string
  console.log('path: ', path);
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  //Get the HTTP methods;
  var method = req.method.toLowerCase();  

  // Get the query string object;
  var queryString = parsedUrl.query;

  //Get headers;
  var headers = req.headers;

  //Get the payloads if it is;
  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data', function (data) {
    buffer += decoder.write(data);
  });

  req.on('end', function () {
    buffer += decoder.end();
    
    // choose the handler request should go to, if one isn't found use notfound handler
    var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    // Construst a data object to send to the handler
    var data = {
      'trimmedPath': trimmedPath,
      'queryString': queryString,
      'method': method,
      'payload': buffer
    };

    // Router request to the handler specified in the router.
    chosenHandler(data, function (statusCode, payload) {
      // Use the staus code calloed back by the handler, or default
      statusCode = typeof(statusCode) === 'number' ? statusCode : 200;

      // Use payload called back by the handler, or default too
      payload = typeof(payload) === 'object' ? payload : {};

      // Convert the payload to a string
      var payloadString = JSON.stringify(payload);
      
      // Return respond;
      res.setHeader('Content-Type','application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

// then log path the user asked for
    // console.log('Request received path: ' + trimmedPath + ' with the method ' + method + ' with these query string params: ', queryString); 
    console.log('Returning this response: ', statusCode, payloadString);
    });
  });
});

//Start server  and have it listen on port 3000;
server.listen(config.port, function () {
  console.log('Server is listening on port ' + config.port +  ' in ' + config.envName + ' now');
});

//Define handlers
var handlers = {};

handlers.sample = function (data, callback) {
  //callback http status code and payload object

  callback(406, {'name': 'sample handler'});
};

//Not found handler;
handlers.notFound = function (data, callback) {

  callback(404);
};
//Define a request router 

var router = {
  'sample': handlers.sample
};
