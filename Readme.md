# Formidable on Heroku

## Purpose

A node.js example for parsing form data using formidable without the need to first save the data to file.
This makes it possible to deploy this functionality on heroku. 

## Current status

This module was developed for parsing text data line by line using [lazy](https://github.com/pkrumins/node-lazy).
Nothing has been tested yet, but I'm able to upload text files and parse them one line at a time. 

## Features

In my fork of formidable I added functionality (lib/incoming_form.js) for supplying a custom WriteStream
instead of the 'fs' WriteStream. This example project shows how to make it work.

Basically, instead of:

	var formidable = require('formidable');
	var form = new formidable.IncomingForm();
 
you use:

	var LazyFile = require('./lazyfile');
	var formidable = require('formidable');
	var form = new formidable.IncomingForm(LazyFile);

Of course in LazyFile, you have to provide functionality that results in a WriteStream exactly as the ./lib/file.js does
(available in formidable). This probably could have been done more efficiently, but for now this is how I did it: 

LazyFile is a copy of lib/file.js (in formidable) providing a WriteStream that looks like this:

	var Lazy = require('lazy');
	...
	var WriteStream = function() {
		this.lazy = new Lazy();
		this.lazy.lines
			.map(String)
			.map(function(line){
				console.log(line);
				return line; 
			});
	}
	
	WriteStream.prototype.open = function() {
	};
	
	WriteStream.prototype.write = function(buffer, cb) {
		this.lazy.emit('data', buffer);
		cb();
	}
	
	WriteStream.prototype.end = function(cb) {
		this.lazy.emit('end');
		cb();
	}

So when you upload a (text) file, this WriteStream will actually output the lines to console. Imagine what you can do like this
using your own version of WriteStream. All without saving the uploaded file to disk first, so this could also be deployed on Heroku.

## License

Formidable is licensed under the MIT license. This example is free, no guarantees (yet) though. 

## Credits

* [Felix Geisendšrfer] (http://felixge.de)
* [Ryan Dahl](http://twitter.com/ryah)
