"use strict";

/**
 * The entire purpose of this file is to load the bundled cacert.pem file and
 * write it to a location that the native app can access. This is mainly in
 * response to android forcing our hand and not providing the system certs in a
 * standard location. So we have to bundle our own and point the app to them.
 */

var openssl_cert_file = false;
document.addEventListener('deviceready', function() {
	var poll_interval = setInterval(function() {
		if(!cordova.file) return;
		clearInterval(poll_interval);

		var write_certfile = function() {
			return new Promise(function(resolve, reject) {
				window.resolveLocalFileSystemURL(cordova.file.dataDirectory+'', function(dir) {
					dir.getFile('cacert.pem', {create: true, exclusive: false}, function(file) {
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
});

