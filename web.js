var express = require('express');
var app = express.createServer();

var handlers = require('./lib/handlers');

var port = process.env.PORT || 5000

app.configure(function() {
   app.use(express.static(__dirname + '/public'));
   app.use(express.errorHandler());
});

app.get('/', function(req,res,next) {
	res.redirect('/index.html');
});

//add the required route
handlers.configure(app);

app.listen(port,function() {
	console.log('server started on port: ' + port);
});
