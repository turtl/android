document.addEventListener('deviceready', function() {
	document.addEventListener('backbutton', function(e) {
		log.debug('cordova: event: back', e);
		if(!turtl || !turtl.back) return true;
		if(turtl.back.empty())
		{
			navigator.Backbutton.goBack(function() {}, function(err) { log.error('turtl: mobile: back:', derr(err)); });
			return;
		}

		e.stopPropagation();
		e.preventDefault();

		turtl.back.back();
		return false;
	}, false);

	document.addEventListener('menubutton', function(e) {
		log.debug('cordova: event: menu', e);
		if(!turtl || !turtl.events) return;

		e.stopPropagation();
		e.preventDefault();

		turtl.events.trigger('sidebar:toggle');
		return false;
	}, false);

	document.addEventListener('searchbutton', function(e) {
		log.debug('cordova: event: search', e);
		if(!turtl || !turtl.events) return;

		e.stopPropagation();
		e.preventDefault();

		turtl.events.trigger('search:toggle');
		return false;
	}, false);
}, false);

