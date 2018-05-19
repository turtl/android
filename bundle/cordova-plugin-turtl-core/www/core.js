var TurtlCore = (function() {
	var exec = function(action, args) {
		return new Promise(function(resolve, reject) {
			cordova.exec(
				function(res) {
					resolve(res);
				},
				function(err) {
					reject(err);
				},
				'TurtlCorePlugin',
				action,
				args
			);
		});
	};

	this.start = function(config) {
		return exec('start', [config]);
	};

	this.send = function(msg) {
		return exec('send', [msg]);
	};

	this.recv = function(mid) {
		var args = [];
		if(mid) args.push(mid);
		return exec('recv', args);
	};

	this.recv_nb = function(mid) {
		var args = [];
		if(mid) args.push(mid);
		return exec('recv_nb', args);
	};

	this.recv_event = function() {
		return exec('recv_event', []);
	};

	this.recv_event_nb = function() {
		return exec('recv_event_nb', []);
	};

	this.lasterr = function() {
		return exec('lasterr', []);
	};
});

module.exports = new TurtlCore();

