"use strict";

(function() {
	var add_auto_login = function()
	{
		if(!window.SecureCache) return;

		// set up our turtl <--> cache service bindings
		var auto_login_enabled = false;
		turtl.events.bind('auth:add-auto-login', function() {
			SecureCache.foreground('Turtl', 'Stay logged in to Turtl', function(err, res) {
				if(err) return log.error('securecache: problem starting login service', err);
				auto_login_enabled = true;
			});
		});
		turtl.events.bind('auth:remove-auto-login', function() {
			auto_login_enabled = false;
			SecureCache.stop(function(err, res) {
				if(err) return log.error('securecache: problem stopping login service', err);
			});
		});
		turtl.events.bind('auth:save-login', function(data) {
			if(!auto_login_enabled) return;
			SecureCache.set(JSON.stringify(data), function(err, res) {
				if(err) return log.error('securecache: problem caching auth', err);
			});
		});

		// try to auto-login right at the start
		SecureCache.get(function(err, res) {
			if(err) return log.error('securecache: problem grabbing cached auth', err);
			if(!res) return;
			turtl.user.login_from_key(JSON.parse(res));
		});
	};

	document.addEventListener('deviceready', function() {
		if(!turtl.loaded)
		{
			turtl.events.bind_once('loaded', add_auto_login);
		}
		else
		{
			add_auto_login();
		}
	});
})();

