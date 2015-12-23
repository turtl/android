//
// some mobile-oriented app config overrides
//

if(typeof(config) == 'undefined') config = {};
Object.merge(config, {
	api_url: 'https://api.turtl.it/v2',
	client: 'mobile-'+cordova.platformId,
	version: cordova_app_version,
	cookie_login: false,
	catch_global_errors: true,
	base_url: window.location.toString().replace(/\/(index\.html)?$/, '/app')
});

