const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  ws.send('{"action":"send","data":{"address":"PixelyIon","message":"Hey"}}');
  ws.send('{"action":"send","data":{"address":"","message":"Hey"}}');
  ws.send('{"action":"send","data":{"address":"PixelyIon","message":""}}');
  ws.send('{"action":"error","data":{"address":"PixelyIon","message":"Hey"}}');
  ws.send('{"data":{"address":"PixelyIon","message":"Hey"}}');
  ws.send('{"action":"battery","data":{"random":"useless data but still accessable"}}');
});

ws.on('message', function incoming(data) {
  console.log(data);
});