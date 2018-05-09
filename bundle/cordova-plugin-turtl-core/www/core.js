var SecureCache = (function() {
	var exec = function(action, cb, args)
	{
		cordova.exec(function(res) { cb(null, res); }, function(err) { cb(err, null); }, 'SecureCache', action, args);
	};

	this.foreground = function(title, text, cb)
	{
		exec('foreground', cb, [title, text]);
	};

	this.unforeground = function(cb)
	{
		exec('unforeground', cb, []);
	};

	this.set = function(data, cb)
	{
		exec('set', cb, [data]);
	};

	this.wipe = function(cb)
	{
		exec('wipe', cb, []);
	}

	this.get = function(cb)
	{
		exec('get', cb, []);
	};

	this.stop = function(cb)
	{
		exec('stop', cb, []);
	}
});

module.exports = new SecureCache();

