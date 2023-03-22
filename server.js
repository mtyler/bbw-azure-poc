var app = require('./app');
var http = require('http');

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

server.listen(3000, function() {
    console.log("App started!")
});

module.exports = server