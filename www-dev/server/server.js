'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_PORT = process.env.NODE_PORT || '9000';

var mongoose = require('./config/mongoose');
var express = require('./config/express');

var debug = require('debug')('Express4');
var url = require('url') ;
var http = require('http');

var db = mongoose();
var ex = express(db);

var server = http.createServer(ex);


// server.listen(ex.get('port'), function() {
//     console.log('Express server listening on port ' + server.address().port);
// });

 server.listen(process.env.NODE_PORT, function() {
    console.log('Express server listening on port ' + server.address().port);
 });

server.on('error', onError);
server.on('listening', onListening);

// Use the module.exports property to expose our Express application instance for external usage
module.exports = server;

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    var port;

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
}