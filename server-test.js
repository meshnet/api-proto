const API = require('./api.js');

const server = new API.Server();

var stdin = process.openStdin();

stdin.addListener("data", function(d) {
  // note:  d is an object, and when converted to a string it will
  // end with a linefeed.  so we (rather crudely) account for that
  // with toString() and then trim()
/*console.log("you entered: [" +
    d.toString().trim() + "]");*/
  var command = d.toString().trim().split(' ');
  switch(command[0].toLowerCase()) {
    case "receive":
      console.log("Received " + command[2] + " from " + command[1]);
      server.broadcast({"action":"receive","data":{"address":command[1],"message":command[2]}});
      break;
    default:
      console.log("Command \"" + command[0] + "\" not found");
  }
});

server.register('send', ['message'], function received(args, response) {
  console.log("Sending \"%s\" to \"%s\"", args['message'], args['address']);
  response['data']['message'] = args['message'];
  response['success'] = true;
});

server.register('battery', [], function received(args, response) {
  console.log('Sending battery level');
  response['data']['battery'] = '42%';

  // This bit just to show that you can pass any extra arguments as long as you also pass the required ones, and they can be accessed here.
  // Just wanted to show it since it isnt an immediately obvious feature.
  for (var arg in args) {
    if (args.hasOwnProperty(arg)) {
      response['data'][arg] = args[arg];
    }
  }

  response['success'] = true;
});
