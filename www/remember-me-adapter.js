RememberMe.adapters.android_keystore = Composer.Event.extend({
	initialize: function(_options) {
	},

	get_login: function() {
		return TurtlStore.load()
			.then(function(res) {
				var token = JSON.parse(res).key;
				if(!token) return null;
				var decoded = JSON.parse(atob(token));
				return {user_id: decoded.user_id, key: decoded.key};
			});
	},

	save: function(user_id, key) {
		var token = JSON.stringify({user_id: user_id, key: key});
		return TurtlStore.save(btoa(token));
	},

	clear: function() {
		return TurtlStore.clear();
	},
});

