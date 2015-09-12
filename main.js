$( function() {
	edflockGameWeb = new EdflockGameWeb();
	edflockGameWeb.provideUserName((function() {
		var x = 1;
		return function() {
			return "ujjwal" + (x++);
		}
	}) ());

	edflockGameWeb.subscribePointAdded(function(d,e) {
		$('#points').append(e.data)
	});

	edflockGameWeb.subscribeStatusChange(function(d,e) {
		$('#status').html(e.data)
	});
	/*edflockGameWeb.initialize();*/
});
