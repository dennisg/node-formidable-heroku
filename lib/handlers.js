var formidable = require('formidable');
var LazyFile = require('./lazyfile');

var parse = function(req,res,next) {
	var form = new formidable.IncomingForm(LazyFile);

    form.uploadDir = __dirname;
    console.log("dir " + form.uploadDir);
	form
	  .on('error', function(err) {
	    res.writeHead(200, {'content-type': 'text/plain'});
	    res.end('error:\n\n');
	  })
	  .on('field', function(field, value) {
	    console.log(field, value);
	  })
      .on('file', function(field, file) {
      })
      .on('end', function() {
        console.log('-> upload done');
        res.writeHead(200, {'content-type': 'application/json'});
        res.end(JSON.stringify({ok : true }));
      });
	
	form.parse(req);
}
var configure = function(app, opts) {
	opts = opts || {};
	
	app.post('/upload', parse);
}

module.exports = {
	configure : configure 
}


