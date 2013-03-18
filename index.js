"use strict";
var pubSub = require('amqputil');

var deferredCommands = [];

module.exports = function (config) {
	pubSub.connect(config.queueUri, config.commandQueue, function connectCb(sub) {
		sub.subscribeToFanoutQueue(function (msgEnv) {
			var msg = msgEnv.data;
			deferredCommands.push(function (cb) {
				msgEnv.ack();
				var commandFunction = o.commandMap[msg.type];
				if(!commandFunction)
					return cb();

				commandFunction(msg, cb);
			});

			if (!o.defer)
				o.runDeferred();
		});
	});

	var defaultCommandMap = {
		restart:function (msg, cb) {
			console.log('Restart requested -- goodbye cruel world! pid:' + process.pid);
			process.exit(0);
		}
	};

	var o = {
		defer:false,
		runDeferred:function (runDeferredCb) {
			if (!runDeferredCb) runDeferredCb = function runDeferredDefaultCb() {};
			if (deferredCommands.length === 0)
				return runDeferredCb();
			deferredCommands.pop()(runDeferredCb);	//Just one-at-a-time for now
		},
		commandMap:defaultCommandMap
	};

	return o;
};
