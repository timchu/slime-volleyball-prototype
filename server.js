const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// Functions supporting player id assignment.
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

// Sockets and stuff.


var ball = {
  x: 0,
  y: 0,
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


  socket.on('ball coordinates', (ballCoords) => {
    ball.x = ballCoords.x;
    ball.y = ballCoords.y;
    console.log("Ball coords changed");
    io.emit('ball coordinates', ballCoords);
  });

  io.emit('player_id', player_id);
  socket.on('slime coordinates', (slimeCoords) => {
    slime_id = slimeCoords.slime_id;
    x = slimeCoords.x;
    y = slimeCoords.y;
//    console.log("Slime coords changed");
    players[socket.id].x = x;
    players[socket.id].y = y;
    io.emit('slime coordinates', slimeCoords);
  });

  socket.on('disconnect', function () {
    console.log('user disconnected');
    delete players[socket.id];
  });
});
server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});
