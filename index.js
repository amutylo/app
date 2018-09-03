/**
 * Primary file for API.
 */

// Dependencies
var http = require('http');
var url = require('url');

// The server should respond to all requests with a string
var server = http.createServer(function (req, res) {
  // get url and parse it;
  var parsedUrl = url.parse(req.url, true);

  //get the path from url;
  var path = parsedUrl.pathname;
  // trim all slashes from both sides of the path string
  console.log('path: ', path);
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');
  // var trimmedPath = path.replace(/^\/+|\/+$/g, '');
  

  
  //send a response;
  res.end(' Hello world! ');

  // then log path the user asked for
  console.log('Request received path:', trimmedPath); 
});

//Start server  and have it listen on port 3000;
server.listen(3000, function () {
  console.log('Server is listening on port 3000');
});