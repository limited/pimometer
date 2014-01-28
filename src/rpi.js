var gpio = require("pi-gpio");
var async = require("async");

// Pins are given as "Board" pins, not using broadcom numbering
var clkPin = 23;
var misoPin = 21;
var csPin = [12, 16, 18, 22];

// Setup pins as output, with clkPin set to low and cs high
function setupPins() {

    async.series([
	function(callback) {
	    gpio.open(clkPin, "output", callback);
	},
	function(callback) {
	    gpio.open(misoPin, "input", callback);
	}
    ],
    function(err, results) {
	if (err)
	    console.log('Error: '+err);
    });

    async.each(csPin, 
	       function(item, callback) {
		   gpio.open(csPin[item], "output", callback);
	       },
	       function(err, results) {
		   if (err)
		       console.log('Error: '+err);
	       });
}

// Setting CS low kicks off the conversion
// Then read 16 bits and apply weights
//
// Callback is cb(err, TC value)
// Reference junction temp not currently returned
function readThermocouple(channel, callback) {
    var bitsToRead = 24;

    var callarray = [];

    callarray.push(function(callback) {
	gpio.write(csPin[channel], 1, callback)
    });

    for (var i = 0; i < bitsToRead, i++) {
	callarray.push(readBit);
    }

    callarray.push(function(callback) {
	gpio.write(csPin[channel], 0, callback)
    });
    
    async.series(callarray, 
		 function(err, results) {
		     results.shift();
		     results.pop();
		     callback(results);
		 });
}

function readBit() {
    async.series([
	function(callback) {
	    gpio.read(misoPin, callback);
	},
	function(callback) {
	    gpio.write(clkPin, 1, callback);
	},
	function(callback) {
	    gpio.write(clkPin, 0, callback);
	}
 ],

function(err, results) {
    if (err)
	throw err;

    return results[0];
});
}

module.exports.setupPins = setupPins;
module.exports.getTempState = readThermocouple;