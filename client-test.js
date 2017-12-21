const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', function open() {
  this.received = "";

  ws.on('message', (function incoming(data) {
    this.received = data;
  }).bind(this));

  test(ws, {"action":"send","data":{"address":"PixelyIon","message":"Hey"}}, true);
});

/*
ws.send('{"action":"send","data":{"address":"PixelyIon","message":"Hey"}}');
ws.send('{"action":"send","data":{"address":"","message":"Hey"}}');
ws.send('{"action":"send","data":{"address":"PixelyIon","message":""}}');
ws.send('{"action":"error","data":{"address":"PixelyIon","message":"Hey"}}');
ws.send('{"data":{"address":"PixelyIon","message":"Hey"}}');
ws.send('{"action":"battery","data":{"random":"useless data but still accessable"}}');
*/

function test(ws, message, expected, error) {
  var sucess = true;
  console.log("Sending " + JSON.stringify(message));
  ws.send(JSON.stringify(message));
  while(this.received === "");
  console.log(this.received);
  if(JSON.parse(this.received)["success"] !== expected)
    success = false;
  if(expected === false && JSON.parse(this.received)["error"] !== error)
    success = false;
  if(success)
    console.log("Test passed!");
  else
    console.error("Test Failed!");
}
