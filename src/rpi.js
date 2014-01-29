var gpio = require("pi-gpio");
var async = require("async");

// Pins are given as "Board" pins, not using broadcom numbering
var clkPin = 16;//23;
var misoPin = 12; //21;
var csPin = ["18"];//[12, 16, 18, 22];

// Setup pins as output, with clkPin set to low and cs high
function setupPins() {

    async.series([
	function(callback) {
	    gpio.open(clkPin, "output", callback);
	},
	function(callback) {
	    gpio.write(clkPin, 0, callback);
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
		   gpio.open(item, "output", function() {
                     gpio.write(item, 0, callback);
                   });
	       },
	       function(err, results) {
		   if (err)
		       console.log('Error: '+err);
	       });
}

function closePins() {
    async.series([
	function(callback) {
	    gpio.close(clkPin, callback);
	},
	function(callback) {
	    gpio.close(csPin[0], callback);
	},
	function(callback) {
	    gpio.close(misoPin, callback);
	}
    ],
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
    var bitsToRead = 32;

    var callarray = [];

    callarray.push(function(callback) {
	gpio.write(clkPin, 0, callback)
    });

    callarray.push(function(callback) {
	gpio.write(csPin[channel], 0, callback)
    });

    for (var i = 0; i < bitsToRead; i++) {
	callarray.push(readBit);
    }

    callarray.push(function(callback) {
	gpio.write(csPin[channel], 1, callback)
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
	    gpio.write(clkPin, 1, callback);
	},
	function(callback) {
	    gpio.read(misoPin, callback);
	},
	function(callback) {
	    gpio.write(clkPin, 0, callback);
	},
        function(callback) {
	  setTimeout(callback, 1);
        }, 
     ],

     function(err, results) {
       if (err)
 	throw err;
       console.log(results);
       return results[0];
     });
}
setupPins();
readThermocouple(0, function(err, tcValue) {
  console.log("TC Value is: "+tcValue);
});
closePins();
console.log("Hi");


//module.exports.setupPins = setupPins;
//module.exports.getTempState = readThermocouple;
