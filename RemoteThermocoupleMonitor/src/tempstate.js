var config = {numChannels: 4, 
	      historySize: 30,
	      avgSize: 10,
	      updatePeriod: 1000};

var title = ["Channel 1", "Channel 2", "Channel 3", "Channel 4"];
  
function buildState() {
    var state = {};
    state.channels = [];
    for (i = 0; i < config.numChannels; i++) {
	state.channels.push({title: title[i],
			     current: 250, // XXX_EF Fake starting temp
			     min: 1000000,
			     max: 0, 
			     movingAvg: 0,
			     range: []});
    }
    return state;
}
var tempState = buildState();

function updateStats(channel, current) {
    channel.current = current;
    channel.range.push(channel.current);

    if (current < channel.min) {
	channel.min = current;
    }

    if (current > channel.max) {
	channel.max = current
    }

    if (channel.range.length >= config.historySize) {
	channel.range.shift()
    }

    // compute moving avg over last few
    var avgWindow = channel.range.slice(-1 * config.avgSize);
    channel.movingAvg = avgWindow.reduce(function(a, b) {
	return a + b; }, 0) / avgWindow.length;
 }

setInterval(function() {
    for (var i = 0; i < config.numChannels; i++) {
	var current = tempState.channels[i].current;
	current += (Math.random()*3.0 - 1.0);
	updateStats(tempState.channels[i], current);
    }
}, config.updatePeriod);


function getTempState() {
    return tempState;
}

module.exports.getTempState = getTempState;