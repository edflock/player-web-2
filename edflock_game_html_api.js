(function(window, $, postal) {
	var GameWebTransport = postal;
	GameWebTransport.instanceId('gameWeb');
	
	// We need to tell postal how to get a deferred instance
	GameWebTransport.configuration.promise.createDeferred = function() {
	    return new $.Deferred();
	};
	// We need to tell GameWebTransport how to get a "public-facing"/safe promise instance
	GameWebTransport.configuration.promise.getPromise = function(dfd) {
	    return dfd.promise();
	};
	GameWebTransport.fedx.addFilter([
	    { channel: 'users',    topic: '#', direction: 'both'  },
	    { channel: 'iframez',   topic: '#', direction: 'both'  },
	    { channel: 'points',   topic: '#', direction: 'both' },
	    { channel: 'status',   topic: '#', direction: 'both' }
	]);

	GameWebTransport.addWireTap(function(d, e) {
	    console.log("ID: " + GameWebTransport.instanceId() + " - " + JSON.stringify(e, null, 4));
	});

	window.edFlockGameWebTransport = GameWebTransport;
	edFlockGameWebTransport.fedx.signalReady();

	window.EdflockGameWeb = function() {
		// TODO: See to fix this
		/*var users = edFlockGameWebTransport.channel('users'),
			score = edFlockGameWebTransport.channel('score');*/

		/*users.subscribe('username', function(data, envelope) {
		    var result = "gotcha";
		    console.log('recieved')
		    envelope.reply(null, result);
		});*/
		this.transport = edFlockGameWebTransport;
		/* It expect options as 
		*	{
		*		channel : "",
		*		topic : '',
		*		data : {}
		*	}
		*
		* Subscribes to topic = 'topic.request' and publish the data in the form of 'topic.response'
		*/
		this.subscribeAndReply = function(options) {
			var channel = options.channel || 'generic',
				topic = options.topic || '#',
				data = options.data || {};

			this.transport.subscribe({
				channel  : channel,
				topic    : topic + '.request',
				callback : function() {
        		    edFlockGameWebTransport.publish({
	                    channel: channel,
	                    topic: topic + ".response",
	                    data: data
	                });
				}
			});
		}

		this.requestForData = function(options) {
			var channel = options.channel || 'generic',
				topic = options.topic || '#',
				callback = options.callback || function() {console.log('no call back given')};

			this.transport.publish({
                channel: channel,
                topic: topic + ".request"
            });

			this.transport.subscribe({
				channel  : channel,
				topic    : topic + ".response",
				callback : callback
			}).once();
		}

		this.provideUserName = function(data) {
			this.subscribeAndReply({channel: 'users', topic: 'name', data: data});
		}

		this.subscribePointAdded = function(cb) {
			this.transport.subscribe({
				channel: 'points',
				topic: 'points.add',
				callback: cb
			});
		}

		this.subscribeStatusChange = function(cb) {
			this.transport.subscribe({
				channel: 'status',
				topic: 'status.change',
				callback: cb
			});
		}

	}
	
}) (window, $, postal)



