/**
 * Created by robertkarlsson on 29/04/16.
 */
var server = require('http').createServer()
    , WebSocketServer = require('ws').Server
    , wss = new WebSocketServer({ server: server })
    , express = require('express')
    , app = express()
    , port = 4080;

app.use(express.static('public'));

wss.on('connection', function connection(ws) {

    ws.on('message', function incoming(message) {

        if(typeof message === "string"){

            var  socketEvent = message.split("/")[0];

            emitHandler[socketEvent](message);

        }

    });
});

server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });


wss.broadcast = function broadcast(data) {
    this.clients.forEach(function each(client) {
        client.send(data);
    });
};

var emitHandler = {
    //(draw/lastOffX/lastOffY/offX/offY)
    draw: function(data){
        wss.broadcast(data)
    }

};