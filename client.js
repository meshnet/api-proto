const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  ws.send('{"action":"send","address":"PixelyIon","message":"Hey"}');
	ws.send('{"action":"send","address":"","message":"Hey"}');
	ws.send('{"action":"send","address":"PixelyIon","message":""}');
	ws.send('{"action":"error","address":"PixelyIon","message":"Hey"}');
});

ws.on('message', function incoming(data) {
  console.log(data);
});