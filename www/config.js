//
// some mobile-oriented app config overrides
//

if(typeof(config) == 'undefined') config = {};
Object.merge(config, {
	api_url: 'http://turtl.dev:8181',
	client: 'mobile-'+cordova.platformId,
	version: cordova_app_version,
	cookie_login: false,
	base_url: window.location.toString().replace(/\/(index\.html)?$/, '/app'),
	has_autologin: true
});

