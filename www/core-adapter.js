(function() {
"use strict";

var TurtlCore = null;
var core_init = false;

var CoreMessenger = Composer.Event.extend({
	poller: null,

	initialize: function() {
		var poll_interval = 100;
		this.poller = setInterval(this.poll.bind(this), poll_interval);
	},

	poll: function() {
		this.poll_messages();
		this.poll_events();
	},

	poll_messages: function() {
		if(!core_init) return Promise.resolve();
		return TurtlCore.recv_nb()
			.bind(this)
			.then(function(msg) {
				if(!msg) return;
				this.trigger('message', msg);
			})
			.catch(function(err) {
				log.error('CoreMessenger.poll_messages() -- ', err);
			});
	},

	poll_events: function() {
		if(!core_init) return Promise.resolve();
		return TurtlCore.recv_event_nb()
			.bind(this)
			.then(function(msg) {
				if(!msg) return;
				this.trigger('message', msg);
				// if we got an event, poll immediately on next tick
				setTimeout(this.poll_events.bind(this), 5);
			})
			.catch(function(err) {
				log.error('CoreMessenger.poll_events() -- ', err);
			});
	},

	send: function(msg) {
		if(!core_init) return Promise.resolve();
		return TurtlCore.send(msg);
	},

	destroy: function() {
		clearInterval(this.poller);
		this.poller = null;
		this.unbind();
	},
});

CoreComm.adapters.mobile = Composer.Event.extend({
	conn: null,

	// holds messages sent before the stupid core initialized. required to deal
	// with some of cordova's plugin loading timing issues.
	init_queue: [],

	initialize: function(options) {
		options || (options = {});
		Object.keys(options).forEach(function(key) {
			this.options[key] = options[key];
		}.bind(this));
		setTimeout(this.reconnect.bind(this), 10);

		var init_poller = setInterval(function() {
			if(!core_init) return;
			if(this.init_queue.length == 0) return;
			this.init_queue.forEach(this.send.bind(this));
			this.init_queue = [];
			clearInterval(init_poller);
		}.bind(this), 100);
	},

	close: function() {
		if(this.conn) {
			this.conn.destroy();
			this.conn = null;
			this.trigger('connected', false);
			this.trigger('reset');
		}
	},

	reconnect: function() {
		this.close();
		this.conn = new CoreMessenger();
		this.trigger('connected', true);
		// forward messages
		this.conn.bind('message', this.trigger.bind(this, 'message'));
	},

	send: function(msg) {
		if(!core_init) {
			this.init_queue.push(msg);
			return;
		}
		return this.conn.send(msg);
	},
});

// fix some bullshit timing issues.
var core_poller = setInterval(function() {
	if(!window.TurtlCore) return;
	if(!window.openssl_cert_file) return;
	var datadir = cordova.file.dataDirectory;
	if(!datadir) return;
	datadir = datadir.replace(/^.*?:\/\//, '').replace(/\/+$/, '')+'/core';

	clearInterval(core_poller);
	TurtlCore = window.TurtlCore;
	var cert_file = window.openssl_cert_file;
	var config = Composer.object.clone(turtl_core_config, {deep: true});
	if(!config.logging) config.logging = {};
	config.logging.level = 'info';
	config.data_folder = datadir;
	// the core has no real way of loading the config.yaml asset so we need to
	// to just pass in our entire config as a runtime config. thanks, obama.
	config.config_file = ':null:';
	config.openssl_cert_file = cert_file;
	return TurtlCore.start(JSON.stringify(config))
		.then(function() {
			core_init = true;
		})
		.catch(function(err) {
			console.error('error initializing core: ', err);
			return TurtlCore.lasterr()
				.then(function(lasterr) {
					console.log('lasterr: ', lasterr);
					alert('Error initializing core: '+(lasterr || err));
				})
		});
}, 10);

})();

