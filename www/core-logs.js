function get_core_logs() {
	return new Promise(function(resolve, reject) {
		window.resolveLocalFileSystemURL(cordova.file.dataDirectory+'/core/core.log', function(fileentry) {
			try {
				fileentry.file(function(file) {
					try {
						var reader = new FileReader();
						reader.onload = function() {
							resolve(this.result);
						};
						reader.onerror = reject;
						reader.readAsText(file);
					} catch(e) { reject(e); }
				});
			} catch(e) { reject(e); }
		}, reject);
	});
}

