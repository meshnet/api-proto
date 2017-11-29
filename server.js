const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
		var success = true;
		var error = "";
    var data = JSON.parse(message);
		switch(data["action"]){
			case "send":
				var message = data["message"];
				var address = data["address"];
				if(typeof(message) != "string" || message == ""){
					success = false;
					error = "Message is not the rigth type or empty";
					break;
				}
				if(typeof(address) != "string" || address == ""){
					success = false;
					error = "Address is not the rigth type or empty";
					break;
				}
				console.log("Sending \"%s\" to %s", message, address);
				success = true;
				break;
			default:
				success = false;
				error = "Action not found";
				break;
		}
		var response = {};
		response["success"] = success;
		if(success == false){
			response["error"] = error;
		}
		ws.send(JSON.stringify(response));
  });
});