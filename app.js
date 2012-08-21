var express = require('express');
//  app.register( '.ejs', require('ejs') );
//  app.use( express.static(__dirname + '/public') );


var app = require('express').createServer();
app.get('/', function(req, res) {
    res.send('Hello from <a href="http://appfog.com">AppFog.com</a>');
});
app.use( express.static(__dirname + '/public') );
app.listen(process.env.VCAP_APP_PORT || 3000);

/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end('Hello from <a href="http://appfog.com">AppFog.com</a>');
}).listen(process.env.VMC_APP_PORT || 1337, null);
*/
