const WebSocket = require('ws');

class Server {
  constructor() {
    this.wss = new WebSocket.Server({ port: 8080 });
    this.version = "0.1"; // TODO implement
	this.actions = {};
	
    this.wss.on('connection', (function connection(ws) {
      ws.on('message', (function incoming(message) {
		try {
          var data = JSON.parse(message);
		} catch(e) {
		  this._send(ws, {'success': false, 'error': 'Invalid data format.', 'data': {}});
		  return;
		}
		
		var action = this.actions[data['action']];
		if (action !== undefined) {
		  var args = data['data'];
		  if (args !== undefined && Object.keys(args).length >= action[0].length) {
			action[0].forEach(function (arg) {
			  if (!(args.hasOwnProperty(arg))) {
				this._send(ws, {'success': false, 'error': 'Insufficient arguments.', 'data': {}});
				return;
			  }
			});
			
			var passArgs = args;
			var response = {'success': true, 'error': '', 'data': {}};
			action[1](passArgs, response);
			
			if (response['success'] === undefined || !(response['success'])) {
			  this._send(ws, {'success': false, 'error': (typeof(response['error']) === 'string' ? response['error'] : ''), 'data': {}});
			  return;
			}
			
			this._send(ws, {'success': true, 'error': '', 'data': (typeof(response['data']) === 'object' ? response['data'] : {})});
			return;
		  } else {
			this._send(ws, {'success': false, 'error': 'Insufficient arguments.', 'data': {}});
			return;
		  }
		} else {
			this._send(ws, {'success': false, 'error': 'Action not defined.', 'data': {}});
			return;
		}
      }).bind(this));
    }).bind(this));
  
  }
  
  _send(connection, data) {
	  if (typeof(data) === 'string') {
		try {
          data = JSON.parse(data);
		} catch(e) {
		  return false;
		}
	  }
	  
	  if (data['success'] === undefined || data['error'] === undefined || data['data'] === undefined) {
		return false;
	  }
	  
	  try {
	    connection.send(JSON.stringify(data));
	  } catch(e) {
	    return false;
	  }
	  return true;
  }
  
  register(action, args, cb) {
    if (typeof(args) !== 'object' || typeof(cb) !== 'function') {
	  return false;
	}
	switch(typeof('action')) {
	  case 'string':
	    break;
	  case 'number':
	  case 'boolean':
	    action = action.toString();
	    break;
	  default:
	    return false;
	    break;
	}
	
	this.actions[action] = [[], cb];
	args.forEach((function(arg) {
	  if (typeof(arg) === 'string') {
	    this.actions[action][0].push(arg);
	  }
    }).bind(this));
	
	return true;
  }
  
  unregister(action) {
	this.actions[action] = undefined;
	return true;
  }
}

module.exports = Server;