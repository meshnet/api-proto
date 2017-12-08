const API = require('./api.js');

const server = new API.Server();

server.register('send', ['message'], function received(args, response) {
  console.log("Sending \"%s\"", args['message']);
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