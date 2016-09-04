
var express = require('express');

var app = express();

var server = require('http').createServer(app);

var io=require('socket.io').listen(server);


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/myapp',function(err){
  if(err){
    console.log(err);
  }
  else{
    console.log("connected to db");
  }
});


 usernames=[];

server.listen(3000);

//mongodb part
///////////////////////////////////
var the_schema=mongoose.Schema;

var chat_schema=new the_schema({
user:String,
msg:String,
created:{type:Date ,default:Date.now}
});

chat_model=mongoose.model('chat',chat_schema);

////////////////////////////////////
app.get('/', function(req, res) {

  res.sendFile( __dirname + "/index.html" );
});

io.sockets.on('connection', function (socket) {
chat_model.find({}, function(err, data){
		if(err) {res.json(err);}
		   
   else  { io.sockets.emit('old_msg',data); }
    
	});
 socket.on('username',function(data){

   socket.username=data;
   usernames.push(socket.username);


 });
  socket.on('msg',function(data){

io.sockets.emit('new_msg',{msg:data,user:socket.username});
    new chat_model({
      user:socket.username,
      msg:data

    }).save(function(err)
{
  if(err)  res.json(err); 
  
});
 

  });


 });