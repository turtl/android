document.addEventListener('deviceready', setup_share_to, false);

function setup_share_to() {
	const init_fail = function(err) {
		log.error('share_to::init() -- error: ', err);
	};
	const init_success = function() {
		log.info('share_to::init() -- success!');
		cordova.openwith.addHandler(function(intent) {
			console.log('got share intent: ', intent);
		});
	};
	cordova.openwith.init(init_success, init_fail);
}

