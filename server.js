var express = require('express');
var app = require('express')();
const path = require('path');
var http = require('http').Server(app);
var count = 0; //количество подключившихся
var io = require('socket.io')(http);
const fs = require('fs');
const formid = require('formidable');
const multer = require('multer');
var pathForImage ="";
app.use(express.static('node_modules'));
app.use(express.static('js'));
app.use(express.static('css'));
app.use(express.static('img'));
const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploadedImages");
    },
    filename: (req, file, cb) =>{
        cb(null, file.originalname);
    }
});
app.get('/paintonline', function(req, res){
    res.sendFile(__dirname + '/paint.html');
});
 app.post('/upload', function(req, res){
//         const directory = "img/uploadedImages";
//             fs.readdir(directory, function(err, files){
//                 console.log(directory);
//                 if (err) throw err;
//                 for (const file of files) {
//                     fs.unlink(path.join(directory, file), (err) => {
//                         if (err) throw err;
//                     });
//                 }
                pathForImage = '';
                const directory = "img/uploadedImages";
                var form = new formid.IncomingForm();
                form.uploadDir = directory;
                
                form.on('fileBegin', function (name, file){
                    file.path = form.uploadDir + "/" + file.name;
                    
                }); 
                form.parse(req, function(err, fields, files){
                    console.log(files.fileData.name);
                    pathForImage = '/uploadedImages/' + files.fileData.name;
                    console.log(pathForImage);
                });
                res.send();
  

         });
            

app.get('/', function(req, res){
    res.sendFile(__dirname + '/paint.html');
});

io.on('connection', function(socket){
    count++;
    io.sockets.emit('broadcast', count);

    socket.on('sendLineToServer', function(line){
        socket.broadcast.emit('sendLineToClients', line);
    });
    socket.on('clearCanvas', function(){
        socket.broadcast.emit('clearCanvas');
    });
    socket.on('disconnect', function(){
        count--;
        io.sockets.emit('broadcast', count);
    });
    socket.on('circleToServer', function(data) {
        socket.broadcast.emit('circleToClients', data);
    });
    socket.on('imageDrawForServer', function(){
        socket.broadcast.emit('imageDrawForClients', pathForImage);           
    });
    socket.on('tmpLineDrawingToServer', function(line){
        socket.broadcast.emit('tmpLineDrawingToClients', line);
    });
    socket.on('linePartOfCurveToServer', function(line){
        socket.broadcast.emit('linePartOfCurveToClient', line);
    });
    socket.on('curveIsDoneForServer', function(){
        socket.broadcast.emit('curveIsDoneForClient');
    });
    socket.on('stepBackForServer', function(){
        socket.broadcast.emit('stepBackToClients', 'good job');
    });
});


http.listen(3000, function(){
    console.log("Port 3000 is listening...");
});