$( function() {
	edflockGameWeb = new EdflockGameWeb("iframe");
	edflockGameWeb.provideUserName((function() {
		var x = 1;
		return function() {
			return "ujjwal" + (x++);
		}
	}) ());

	edflockGameWeb.subscribePointAdded(function(d,e) {
		console.log('recieved');

		$('#points').append(e)
	});

	edflockGameWeb.subscribeStatusChange(function(d,e) {
		$('#status').html(e)
	});
	/*edflockGameWeb.initialize();*/
});
