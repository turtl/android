document.addEventListener('deviceready', setup_share_to, false);

function setup_share_to() {
	const init_fail = function(err) {
		log.error('share_to::init() -- error: ', err);
	};
	const handle_intent = function(intent) {
		if(intent.action != 'SEND') return;
		var shared = intent.items[0];
		var note = new Note();
		var file = null;
		var type = null;
		var loader_promise = Promise.resolve();
		var editor = new NotesEditController({
			type: type,
			skip_modal: true,
		});
		var note = editor.model;
		note.unset('type');
		editor.release();
		if(shared.type == 'text') {
			var text = shared.data;
			// is it a url?
			if(text.match(/^([a-z]+?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/i)) {
				type = 'link';
				note.set({url: text});
			} else {
				type = 'text';
				note.set({text: text});
			}
		} else if(shared.path || (shared.uri && shared.uri.match(/^content:\/\//))) {
			// i imagine stuff like that goes on all the time heh heh.
			shared.path = shared.path || shared.uri;
			var filename = shared.path.split('/');
			filename = filename[filename.length - 1];
			if(shared.path.match(/^content:\/\//) && filename.match(/^raw/)) {
				filename = decodeURIComponent(filename).split('/');
				filename = filename[filename.length - 1];
			}
			loader_promise = new Promise(function(resolve) {
				cordova.openwith.load(shared, function(base64_data, _item) {
					type = 'file';
					note.get('file').unset('cleared').set({
						set: true,
						name: filename,
						type: shared.type,
						size: atob(base64_data).length,
						filedata: {
							data: base64_data,
						},
					});
					resolve();
				});
			});
		}
		turtl.show_loading_screen(true);
		return loader_promise.finally(function() {
			note.set({type: type});
			var editor = new NotesEditController({
				model: note,
				type: type,
			});
			turtl.show_loading_screen(false);
		});
	};
	const init_success = function() {
		var onload_intent = null;
		cordova.openwith.addHandler(function(intent) {
			if(!turtl.loaded) {
				onload_intent = intent;
				turtl.events.bind('app:loaded', function() {
					handle_intent(intent);
				}, 'android:share-to:preload:intent');
			} else {
				handle_intent(intent);
			}
		});
	};
	cordova.openwith.init(init_success, init_fail);
}

