/**
 * Created by robertkarlsson on 29/04/16.
 */
var host = location.origin.replace(/^http/, 'ws'),
    socket = new WebSocket(host);

var canvas = document.getElementsByTagName("canvas")[0],
    lastEvent = undefined,
    mouseDown = false;

var emitHandler = {
    //(event/lastOffX/lastOffY/offX/offY)
    draw: function(data){
        data = data.split("/");
        painter.drawOnContext({offsetX: data[1], offsetY: data[2]},{offsetX: data[3], offsetY: data[4]})
    }

};

// MARK: Socket Bindings
socket.onmessage = function(message){
    var  socketEvent = message.data.split("/")[0];
    emitHandler[socketEvent](message.data);
};

var painter = new Painter(canvas);

document.body.addEventListener('click', function(){
    socket.send('draw/12/1')
});

// MARK: Canvas Bindings
canvas.addEventListener("mousedown", function (e) {
    lastEvent = e;
    painter.isDrawing = true;
});

canvas.addEventListener("mouseup", function (e) {
    painter.isDrawing = false;
});

canvas.addEventListener("mousemove", function (event) {

    if(painter.isDrawing) {
        painter.drawOnContext(lastEvent, event, "red");
        var dataToSend = ['draw',lastEvent.offsetX, lastEvent.offsetY, event.offsetX, event.offsetY].join('/');
        socket.send(dataToSend);
        lastEvent = event;
    }

});

// MARK: Painter
function Painter(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
    this.color = "black";
    this.isDrawing = false;
}

Painter.prototype.drawOnContext = function (fromPosition, toPosition) {
    //console.log(fromPosition,toPosition)
    var context = this.context;

    context.beginPath();
    context.moveTo(fromPosition.offsetX, fromPosition.offsetY);
    context.lineTo(toPosition.offsetX, toPosition.offsetY);
    context.strokeColor = this.color
    context.stroke();
};

