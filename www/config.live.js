//
// some mobile-oriented app config overrides
//

if(typeof(config) == 'undefined') config = {};
Object.merge(config, {
	api_url: 'https://api.turtl.it/v2',
	client: 'mobile',
	cookie_login: false,
	base_url: window.location.toString().replace(/\/(index\.html)?$/, '/app')
});

