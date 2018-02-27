const url = require('url');
const WebSocket = require('ws');

function CommunicationBus() {
    
}

CommunicationBus.prototype.sendAll = function(data) {
    if (this.webSocketServer) {
        let json = JSON.stringify(data);
        this.webSocketServer.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(json);
            }
        });
    }
};

CommunicationBus.prototype.sendEventToAll = function(eventName,data) {
    let eventObj = Object.assign({
        name: eventName
    },data);
    this.sendAll(eventObj);
};

CommunicationBus.prototype.linkToWebSocket = function(webSocketServer) {
    this.webSocketServer = webSocketServer;
    this.webSocketServer.on('connection', function connection(ws, req) {
        
        const location = url.parse(req.url, true);
        // You might use location.query.access_token to authenticate or share sessions
        // or req.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
    
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);
        });
    
        //ws.send('something');
    });
};

module.exports = {
  CommunicationBus: function() {
    return new CommunicationBus();   
  }
};
