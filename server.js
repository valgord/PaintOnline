var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var count = 0; //количество подключившихся
var io = require('socket.io')(http);
app.get('/', function(req, res){
    app.use(express.static('node_modules'));
    app.use(express.static('js'));
    app.use(express.static('css'));
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    count++;
    io.sockets.emit('broadcast', count);

    socket.on('penToServer', function(data){
        socket.broadcast.emit('penToClients', data);
    });

    socket.on('disconnect', function(){
        count--;
        io.sockets.emit('broadcast', count);
    });
});


http.listen(3000, function(){
    console.log("Port 3000 is listening...");
});