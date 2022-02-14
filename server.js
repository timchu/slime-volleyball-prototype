const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
//const { Server } = require("socket.io");
//const io = new Server(server);

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

//io.on('connection', (socket) => {
//  socket.on('chat message', (msg) => {
//    socket.broadcast.emit('chat message', msg);
//  });
//});

server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});
