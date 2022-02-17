const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

var ball = {
  x: 0,
  y: 0,
}

function player_length(players) { 
  return Object.keys(players).length;
}

function player_ids(players) {
  keys = Object.keys(players);
  var ls = [];
  for (let i = 0; i < keys.length; i++){
    ls.push(players[keys[i]].player_id);
  }
  return ls.sort();
}

function first_missing_id(players){
  player_id_ls = player_ids(players);
  for (let i = 0; i < player_id_ls.length; i++){
    if (i+1 != player_id_ls[i]){
      console.log("palyer ids loop");
      console.log(player_id_ls[i]);
      console.log(i+1);
      return i+1;
    }
  }
  return player_id_ls.length + 1;
}

var players = {};
app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  player_id = first_missing_id(players);
  players[socket.id] = {
    player_id: player_id,
    x: 0,
    y: 0,
  }
  console.log("Socket ID serverside");
  console.log(socket.id);
  console.log("Players");
  console.log(players);

  console.log("Players length");
  console.log(Object.keys(players));
  console.log(player_ids(players));
  console.log(player_length(players));

  io.emit('player_id', player_id);
  socket.on('slime movement', (msg) => {
    console.log("Slime jumped");
    io.emit('slime movement', msg);
  });
  socket.on('disconnect', function () {
    console.log('user disconnected');
    delete players[socket.id];
  });
});
server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});
