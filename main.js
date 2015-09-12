$( function() {
	edflockGameWeb = new EdflockGameWeb();
	edflockGameWeb.provideUserName('ujjwal');

	edflockGameWeb.subscribePointAdded(function(d,e) {
		$('#points').append(e.data)
	});

	edflockGameWeb.subscribeStatusChange(function(d,e) {
		$('#status').html(e.data)
	});
	/*edflockGameWeb.initialize();*/
});
