var mockery = require('mockery');
var mfCommon = require('mf-common');
var mockQueueWriter = mfCommon.testHelpers.mockWorkQueueWriter;
var test = require('tap').test;

test('Testing the command queue', function(t){
	t.test('Calls the default command',function(t){
		t.ok(true);
		t.end();
	});
});

