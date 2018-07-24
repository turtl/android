if(typeof(config) == 'undefined') config = {};
Object.merge(config, {
	client: 'mobile-'+cordova.platformId,
	version: cordova_app_version,
	cookie_login: false,
	base_url: window.location.toString().replace(/\/(index\.html)?$/, '/app'),
	has_autologin: true,
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

