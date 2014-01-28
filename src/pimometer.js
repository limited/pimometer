var app = require('http').createServer(handler),
io = require('socket.io').listen(app),
fs = require('fs'), 
url = require('url'),
ts = require('./tempstate');

updatePeriod = 1000;
port = 80;
app.listen(port);

function handler(req, rsp) {
    path = url.parse(req.url).pathname;
    if (path == '/') {
	path = '/index.html';
    }
    fs.readFile(__dirname + path,
		function(err, data) {
		    if (err) {
			console.log(err);
			rsp.writeHead(500);
			return rsp.end('Error loading '+path);
		    } 

		    rsp.writeHead(200);
		    rsp.end(data)
		});
}
	 
io.sockets.on('connection', function(sock) {
    console.log('new connection');

    var updateTimer = setInterval(function() {
	sock.emit('update', {state: ts.getTempState()});
    }, updatePeriod);
    
    sock.on('disconnect', function() {
	clearInterval(updateTimer);
    });
});

