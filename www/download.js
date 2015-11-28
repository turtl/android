var blob_to_arraybuffer = function(blob)
{
	return new Promise(function(resolve, reject) {
		var reader = new FileReader();
		reader.onload = function() {
			resolve(this.result);
		};
		reader.onerror = reject;
		reader.onabort = reject;
		reader.readAsArrayBuffer(blob);
	});
};

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
	barfr.barf('Viewing files on mobile is currently broken. We\'re working on a fix. Sorry for the trouble!');
	return;
	// -------------------------------------------------------------------------

	var url;
	return new Promise(function(resolve, reject) {
		var name = options.name || 'download';
		log.info('file: start: ', name);
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(filesystem) {
			filesystem.root.getFile(name, {create: true}, function(entry) {
				var file_url = entry.toURL();
				log.info('file: got fs/file: ', file_url);
				blob_to_arraybuffer(blob)
					.then(function(buffer) {
						var arr = new Uint8Array(buffer);
						entry.createWriter(function(writer) {
							writer.onerror = reject;
							writer.onwriteend = function(e)
							{
								log.info('download: complete', e);
								resolve([file_url, name]);
							};
							writer.write(arr);
						}, reject);
					})
					.catch(reject);
			}, reject);
		}, reject);
	}).spread(function(file_url, name) {
		window.open(file_url);
	}).finally(function() {
		if(url) URL.revokeObjectURL(url);
	});
};

