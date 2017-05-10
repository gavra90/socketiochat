var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);


users = [];
connections = [];



server.listen(process.env.PORT || 3000);
console.log('Server is running....');

app.get('/',function(req,res){
	res.sendFile(__dirname + '/index.html');
});



io.sockets.on('connection',function(socket){
	//todo ako nije konektovan onda ga dodaj
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length);

socket.on('disconnect',function(data){

users.splice(users.indexOf(socket.username),1);
updateUsernames();
	console.log('Disconecting socket');
});

socket.on('send message',function(data) {
	console.log(data);
	io.sockets.emit('new message',{msg:data, user:socket.username});
});

//new user

socket.on('new user',function(data,callback) {
	console.log(data);
		callback(true);
		socket.username=data;
		users.push(socket.username);
		updateUsernames();
	});

function updateUsernames() {

	io.sockets.emit('get users', users);
}
});


