const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

var tests = [
  [{"action":"send","data":{"address":"PixelyIon","message":"Hey"}}, true],
  [{"action":"send","data":{"address":"","message":"Hey"}}, true],
  [{"action":"send","data":{"address":"PixelyIon","message":""}}, true],
  [{"action":"error","data":{"address":"PixelyIon","message":"Hey"}}, false, "Action not defined."],
  [{"data":{"address":"PixelyIon","message":"Hey"}}, false, "Action not defined."],
  [{"action":"battery","data":{"random":"useless data but still accessable"}}, true]
]
var totalSuccess = true;

ws.on('open', function open() {
  test();
});

ws.on('message', function incoming(data) {
  test(data);
});

function test(data) {
  if(data !== undefined){
    var response = JSON.parse(data);
    var success = true;

    if(response["success"] !== tests[0][1]){
      success = false;
    }

    if(tests[0][1] === false && tests[0][2] !== response["error"]){
      success = false;
    }

    if(success){
      console.log("Test passed!");
    } else {
      totalSuccess = false;
      console.error("Test failed!");
    }

    tests.splice(0, 1);
  }
  if(tests[0] === undefined){
    if(totalSuccess) {
      console.log("All tests have passed!");
    } else {
      console.error("Not all tests have passed!");
    }
    return;
  }
  console.log("Sending " + JSON.stringify(tests[0][0]));
  ws.send(JSON.stringify(tests[0][0]));
}
