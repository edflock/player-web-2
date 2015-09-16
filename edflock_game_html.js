(function(window, $, PubSub) {
	var edFlockGameWebTransport = function (argument) {

		var argument = argument || {},
			iframe = argument.iframe || window;

		if (window.addEventListener) {
			// For standards-compliant web browsers
			iframe.addEventListener("message", parseMessage, false);
		}
		else {
			iframe.attachEvent("onmessage", parseMessage);
		}

		function parseMessage(event) {
			var messageData = event.data,
				channel = messageData.channel,
				topic = messageData.topic,
				actualData = messageData.data;
			messageName = channel + "." + topic;
			console.log('main message just recieved = ' + messageName);
			PubSub.publish(messageName, actualData);
		}

		this.publish = function(options) {
			var channel = options.channel || 'generic',
				topic = options.topic || '',
				data = options.data || "";

			var dataMain = {
				channel: channel,
				topic: topic,
				data: data
			};

			messageName = channel + "." + topic;
			
			console.log('main publishing event = '+ messageName);
			PubSub.publish(messageName, data);

			iframe.postMessage(dataMain, "*");
		}

		this.subscribe = function(options) {
			var channel = options.channel || 'generic',
				topic = options.topic || '',
				callback = options.callback || function() {console.log('no call back given')};

			messageName = channel + "." + topic;
			console.log('main subscribe to message = ' + messageName);
			PubSub.subscribe(messageName, callback);
		}

		this.subscribeOnce = function (options) {
			var channel = options.channel || 'generic',
				topic = options.topic || '',
				callback = options.callback || function() {console.log('no call back given')};

			messageName = channel + "." + topic;
			console.log('main subscribing to event once = '+ messageName);

			subscribeId = PubSub.subscribe(messageName, callback);
			PubSub.subscribe(messageName, (function(token) {
				return function() {
					PubSub.unsubscribe( token );
				}
			})(subscribeId));
		}
	}
	window.EdflockGameWeb = function(iframeElementId) {
		// TODO: See to fix this
		/*var users = edFlockGameWebTransport.channel('users'),
			score = edFlockGameWebTransport.channel('score');*/

		/*users.subscribe('username', function(data, envelope) {
		    var result = "gotcha";
		    console.log('recieved')
		    envelope.reply(null, result);
		});*/

		element = document.getElementById(iframeElementId).contentWindow;

		var transport = new edFlockGameWebTransport({iframe: element});
		
		this.transport = transport;
		/* It expect options as 
		*	{
		*		channel : "",
		*		topic : '',
		*		dataFunction: function() {}
		*	}
		*
		* Subscribes to topic = 'topic.request' and publish the data in the form of 'topic.response'
		*/
		this.subscribeAndReply = function(options) {
			var channel = options.channel || 'generic',
				topic = options.topic || '#',
				dataFunction = options.dataFunction || function() {return{}};

			this.transport.subscribe({
				channel  : channel,
				topic    : topic + '-request',
				callback : function() {
					var data = dataFunction();
        		    transport.publish({
	                    channel: channel,
	                    topic: topic + "-response",
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
                topic: topic + "-request"
            });

			this.transport.subscribe({
				channel  : channel,
				topic    : topic + "-response",
				callback : callback
			}).once();
		}

		this.provideUserName = function(dataFunction) {
			this.subscribeAndReply({channel: 'users', topic: 'name', dataFunction: dataFunction});
		}

		this.subscribePointAdded = function(cb) {
			this.transport.subscribe({
				channel: 'points',
				topic: 'points-add',
				callback: cb
			});
		}

		this.subscribeStatusChange = function(cb) {
			this.transport.subscribe({
				channel: 'status',
				topic: 'status-change',
				callback: cb
			});
		}

	}
	
}) (window, $, PubSub)



