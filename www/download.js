/**
 * NOTE: here, we're replacing a function definition from the app, such that
 * files the app is meant to download will be passed here instead.
 */
var download_blob = function(blob, options)
{
	options || (options = {});

	// -------------------------------------------------------------------------
	// NOTE: this not only doesn't really work at all, it screws up the indexeddb
	// database in the app. holding out for a better way to handle files.
	//barfr.barf('Viewing files on mobile is currently broken. We\'re working on a fix. Sorry for the trouble!');
	//return;
	// -------------------------------------------------------------------------

	var url;
	var name = options.name || 'download';
	return new Promise(function(resolve, reject) {
		log.info('file: start: ', name);
		var rejecter = function(name) {
			return function(err) {
				err.step = name;
				reject(err);
			};
		};
		window.resolveLocalFileSystemURL('file:///storage/emulated/0/', function(filesystem) {
			filesystem.getDirectory('Download', {create: true, exclusive: false}, function(dir) {
				dir.getFile(name, {create: true, exclusive: false}, function(entry) {
					var file_url = entry.toURL();
					entry.createWriter(function(writer) {
						writer.onerror = rejecter('write error');
						writer.onwriteend = function(e) {
							log.info('download: complete', e);
							resolve([file_url, name]);
						};
						writer.write(blob);
					}, rejecter('create writer'));
				}, rejecter('get file '+name));
			}, rejecter('get Download/ directory entry'));
		}, rejecter('resolve filesystem url'));
	}).spread(function(file_url, name) {
		barfr.barf(i18next.t('File saved to Download/{{filename}}', {filename: name}));
	}).catch(function(err) {
		barfr.barf(i18next.t('There was a problem saving the file {{filename}}.', {filename: name}));
		log.error('Problem saving file: ', err.step, err);
		throw err;
	}).finally(function() {
		if(url) URL.revokeObjectURL(url);
	});
};

