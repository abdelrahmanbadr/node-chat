
var express = require('express');

var app = express();

var server = require('http').createServer(app);

var io=require('socket.io').listen(server);

 usernames=[];

server.listen(3000);


app.get('/', function(req, res) {
  res.sendFile( __dirname + "/index.html" );
});

io.sockets.on('connection', function (socket) {

 socket.on('username',function(data){

   socket.username=data;
   usernames.push(socket.username);


 });
  socket.on('msg',function(data){
    
io.sockets.emit('new_msg',{msg:data,user:socket.username});
 

  });


 });