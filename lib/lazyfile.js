var Lazy = require('lazy');

var util = require('util'),
    EventEmitter = require('events').EventEmitter;

var WriteStream = function() {
	this.lazy = new Lazy();
	this.lazy.lines
		.map(String)
		.map(function(line){
			console.log(line);
			return line; 
		})
		.map(function(line){ return line; });
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


function LazyFile(properties) {
  EventEmitter.call(this);

  this.size = 0;
  this.path = null;
  this.name = null;
  this.type = null;
  this.lastModifiedDate = null;

  this._writeStream = null;

  for (var key in properties) {
    this[key] = properties[key];
  }
}

module.exports = LazyFile;
util.inherits(LazyFile, EventEmitter);


LazyFile.prototype.open = function() {
  this._writeStream = new WriteStream();
};

LazyFile.prototype.write = function(buffer, cb) {
  var self = this;
 
  this._writeStream.write(buffer, function() {
    self.lastModifiedDate = new Date();
    self.size += buffer.length;
    self.emit('progress', self.size);
    cb();
  });
};

LazyFile.prototype.end = function(cb) {
  var self = this;
  this._writeStream.end(function() {
    self.emit('end');
    cb();
  });
};
