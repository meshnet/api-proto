const http = require('http')
const WebSocket = require('ws');

class Server {
  constructor() {
    const requestHandler = (request, response) => {
      this.connection = response;
      if (request.method == 'POST') {
        var body = '';
        request.on('data', function(data) {
          body += data;
        });
        request.on('end', (function() {
          this._incoming(body);
        }).bind(this));
      } else {
        this._send(response, {
          'success': false,
          'error': 'Invalid http request.',
          'data': {}
        });
      }
    }
    const server = http.createServer(requestHandler)
    this.wss = new WebSocket.Server({
      server
    });
    this.version = "0.1"; // TODO implement
    this.actions = {};

    this.wss.on('connection', (function connection(ws) {
      this.connection = ws;
      ws.on('message', this._incoming.bind(this));
    }).bind(this));

    server.listen(8080, function listening() {
      console.log('Listening on %d', server.address().port);
    });

  }

  _incoming(message) {
    var connection = this.connection;
    try {
      var data = JSON.parse(message);
    } catch (e) {
      this._send(connection, {
        'success': false,
        'error': 'Invalid data format.',
        'data': {}
      });
      return;
    }

    var action = this.actions[data['action']];
    if (action !== undefined) {
      var args = data['data'];
      if (args !== undefined && Object.keys(args).length >= action[0].length) {
        action[0].forEach(function(arg) {
          if (!(args.hasOwnProperty(arg))) {
            this._send(connection, {
              'success': false,
              'error': 'Insufficient arguments.',
              'data': {}
            });
            return;
          }
        });

        var passArgs = args;
        var response = {
          'success': true,
          'error': '',
          'data': {}
        };
        action[1](passArgs, response);

        if (response['success'] === undefined || !(response['success'])) {
          this._send(connection, {
            'success': false,
            'error': (typeof(response['error']) === 'string' ? response['error'] : ''),
            'data': {}
          });
          return;
        }

        this._send(connection, {
          'success': true,
          'error': '',
          'data': (typeof(response['data']) === 'object' ? response['data'] : {})
        });
        return;
      } else {
        this._send(connection, {
          'success': false,
          'error': 'Insufficient arguments.',
          'data': {}
        });
        return;
      }
    } else {
      this._send(connection, {
        'success': false,
        'error': 'Action not defined.',
        'data': {}
      });
      return;
    }
  }

  _send(connection, data) {
    if (typeof(data) === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        return false;
      }
    }

    if (data['success'] === undefined || data['error'] === undefined || data['data'] === undefined) {
      return false;
    }

    try {
      if (connection.constructor.name == "WebSocket") {
        //WebSocket request
        connection.send(JSON.stringify(data));
      } else {
        //Browser request
        connection.end(JSON.stringify(data));
      }
    } catch (e) {
      return false;
    }
    return true;
  }

  register(action, args, cb) {
    if (typeof(args) !== 'object' || typeof(cb) !== 'function') {
      return false;
    }
    switch (typeof('action')) {
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

    this.actions[action] = [
      [], cb
    ];
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

  broadcast(data) {
    if (typeof(data) === 'object') {
      try {
        data = JSON.stringify(data);
      } catch (e) {
        return false;
      }
    }
    this.wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }
}

module.exports = Server;
