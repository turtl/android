"use strict";
var openssl_cert_file = false;
(function() {
	var poll_interval = setInterval(function() {
		if(!cordova.file) return;
		clearInterval(poll_interval);

		function createFile(dirEntry, fileName, isAppend) {
			dirEntry.getFile(fileName, {create: true, exclusive: false}, function(fileEntry) {
				writeFile(fileEntry, null, isAppend);
			}, onErrorCreateFile);
		};
		var write_certfile = function() {
			return new Promise(function(resolve, reject) {
				window.resolveLocalFileSystemURL(cordova.file.dataDirectory+'/core', function(dir) {
					dir.getFile('cacert.pem', {create: true}, function(file) {
						file.createWriter(function(writer) {
							var blob = new Blob([turtl_core_openssl_pem], {type: 'text/plain'});
							writer.onwriteend = function() {
								if(writer.length === 0) {
									writer.write(blob);
								} else {
									var file_loc = file.nativeURL.replace(/.*?:\/\//, '');
									resolve(file_loc);
								}
							};
							writer.onerror = reject;
							writer.truncate(0);
						}, reject);
					}, reject);
				}, reject);
			});
		};

		var openssl_main = function() {
			return write_certfile()
				.then(function(fs_cert) {
					openssl_cert_file = fs_cert;
				})
				.catch(function(err) {
					alert('Problem loading cacert.pem: '+JSON.stringify(err));
					console.error('openssl: problem loading cacert.pem: '+JSON.stringify(err));
				});
		};
		setTimeout(openssl_main, 500);
	}, 10);
})();

