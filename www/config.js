if(typeof(config) == 'undefined') config = {};
Object.merge(config, {
	client: 'android',
	version: cordova_app_version,
	cookie_login: false,
	base_url: window.location.toString().replace(/\/(index\.html)?$/, '/app'),
	has_autologin: true,
	openssl_override_root: false,
	core: {
		adapter: 'mobile',
		options: {},
	},
	remember_me: {
		enabled: true,
		adapter: 'android_keystore',
		options: {},
	},
});

