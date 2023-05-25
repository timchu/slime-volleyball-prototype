var stage;
var slimeOne;
var slimeTwo;
var ball;
var floor = 500;
var leftWallX = 0;
var rightWallX = 1000;
var net;
var netX = (leftWallX + rightWallX)/2;
var netWidth = 4;
var netHeight = 35;
var playerNum = -1;
var playerNumSet = false;

var scoreContainer;
var playerOneScore;
var playerTwoScore;
//  Enum used to keep track of game state.
var state;

var stateEnum = {
  IN_GAME: 0,
  AFTER_POINT: 1,
  PAUSED_GAME: 2,
  END_GAME: 3
}

var lastWinner = "one"; // "one" or "two"
var background;


var slimeOneColor = "LightGreen"
var slimeTwoColor = "Orange"
function receiveSlimeCoords(){
  socket.on('slime coordinates', (slimeCoords) => {
    x = slimeCoords.x;
    y = slimeCoords.y;
    slime_id = slimeCoords.slime_id;
    if (slime_id == 1){
      slimeOne.x = x;
      slimeOne.y = y;
    }
    else if (slime_id == 2){
      slimeTwo.x = x;
      slimeTwo.y = y;
    }
  });
}
// var overScreen;
// // This is used in ball.js. This should all be cleaned up.
// var acceleration = 0.5;

function collideWalls(ball) {
  if (ball.x <= leftWallX + ball.radius || ball.x >= rightWallX - ball.radius) { 
    ball.xSpeed = - ball.xSpeed;
  }
}

// TODO: make this defeat the slime.
function checkFloor(ball) {
  if (ball.y >=  floor - ball.radius) {
    if (ball.x  <= netX) {
      playerOneScore -= 1;
      playerTwoScore += 1;
      lastWinner = "two"
    }
    else {
      playerOneScore += 1;
      playerTwoScore -= 1;
      lastWinner = "one"
    }
    if (playerOneScore == 0){
      state = stateEnum.END_GAME;
    }
    else if (playerTwoScore == 0){
      state = stateEnum.END_GAME;
    }
    else {
      state = stateEnum.AFTER_POINT;
    }
  }
}

function collideNet(ball) {
  var fudgeFactor = 5 
  if (ball.y >= floor - netHeight - ball.radius
      && ball.x > netX - netWidth/2 - ball.radius && ball.x < netX + netWidth/2 + ball.radius) {
    if (ball.y <= floor - netHeight - ball.radius + fudgeFactor && ball.ySpeed > 0) {
      ball.ySpeed = -ball.ySpeed;
      ball.y = floor - netHeight - ball.radius + fudgeFactor;
    }
    else {
      ball.xSpeed = - ball.xSpeed;
      if (ball.x > netX) {
        ball.x = netX + netWidth/2 + ball.radius + fudgeFactor;
      }
      if (ball.x <= netX){
        ball.x = netX - netWidth/2 - ball.radius - fudgeFactor;
      }
    }
  }
}

function initGame() {
  var initSlimeX = 180;
  state = stateEnum.IN_GAME;

  background = new createjs.Shape();
  background.graphics.beginFill("Blue").drawRect(leftWallX, 0, rightWallX, floor);
  stage.addChild(background);

  slimeOne = stage.addChild(makeCircleSlime(slimeOneColor, 'w','s','a','d', initSlimeX));
  slimeTwo = stage.addChild(makeCircleSlime(slimeTwoColor, 'up', 'down', 'left', 'right', rightWallX - initSlimeX));
  net = new createjs.Shape();
  net.graphics.beginFill("White").drawRect(netX - netWidth/2, floor - netHeight, netWidth, netHeight);
  stage.addChild(net);


  if (lastWinner == "one") {
    ball = stage.addChild(makeBall("Yellow", initSlimeX, 200));
  }
  else {
    ball = stage.addChild(makeBall("Yellow", rightWallX  - initSlimeX, 200));
  }

  scoreContainer = new createjs.Container();
  displayScore(playerOneScore, playerTwoScore);

}

function clearGame() {
  stage.removeChild(ball);
  stage.removeChild(slimeOne);
  stage.removeChild(slimeTwo);
  stage.removeChild(scoreContainer);
  stage.removeChild(net);
  stage.removeChild(background);
}

function resetGameAfterPoint() {
  clearGame();
  initGame();
}

function setDefaultScore () {
  playerOneScore = 5;
  playerTwoScore = 5;
}

function resetGameFromBeginning() {
  setDefaultScore();
  clearGame();
  initGame();
}

function displayScore(a, b){
  for (var i = 0; i < a; ++i) {
    // hardcoded arbitrary constants.
    // makeBall should not be overloaded. This is lazy code.
    scoreContainer.addChild(makeBall(slimeOneColor, 36 + 60*i, 45, 18));
  }
  for (var i = 0; i < b; ++i) {
    scoreContainer.addChild(makeBall(slimeTwoColor, rightWallX - 36 - 60*i, 45, 18));
  }
  stage.addChild(scoreContainer);
}

function init() {

  // Set which player you are.
  socket.on('player_id', function(player_id) {
    console.log("Player num initiated");
    if(!playerNumSet) {
      playerNum = player_id;
    }
    playerNumSet = true;
    console.log(playerNum)
  });
  receiveSlimeCoords();
  receiveBallCoords(playerNum);

//  socket.on('slime movement', function(movement) {
//    console.log("Move received");
//    move = movement.move
//    player_id_of_move = movement.id
//    console.log(player_id_of_move)
//    console.log(move)
//    if (player_id_of_move == 1){
//      updateSlimeSpeed(floor, slimeOne, move);
//    }
//    else if (player_id_of_move == 2){
//      updateSlimeSpeed(floor, slimeTwo, move);
//    }
//  });

  stage = new createjs.Stage("demoCanvas");
  setDefaultScore();
  initGame("one");
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.addEventListener("tick", tick);

  var tickCountAfterPoint = 0;
  function tick(event) {
    if (state == stateEnum.IN_GAME) {
      if (key.isPressed('p')){
        state = stateEnum.PAUSED;
        stage.removeChild(scoreContainer);
      }
      collideWalls(ball);
      collideNet(ball);
      updateSlimeSpeed(floor, slimeOne, 1, playerNum);
      keepSlimeInBounds(floor, leftWallX, netX, slimeOne);
      updateSlimeSpeed(floor, slimeTwo, 2, playerNum);
      keepSlimeInBounds(floor, netX + netWidth, rightWallX, slimeTwo);
      if (playerNum == 1) {
        console.log("Broadcasting slime coords (prefix)")
        broadcastSlimeCoords(floor, slimeOne, 1)
      }
      else if (playerNum == 2) {
        broadcastSlimeCoords(floor, slimeTwo, 2)
      }
      updateBall(slimeOne, slimeTwo, ball);
      checkFloor(ball);
      // playerOne broadcasts true state about ball.
      if (playerNum == 1){
        console.log("Broadcast ball coords");
        broadcastBallCoords(ball);
      }
    }
    else if (state == stateEnum.AFTER_POINT){
      if (tickCountAfterPoint == 60) {
        resetGameAfterPoint();
        tickCountAfterPoint = 0;
      }
      else {
        tickCountAfterPoint += 1;
      }
    }
    else if (state == stateEnum.PAUSED){
      if (key.isPressed('r')) {
        state = stateEnum.IN_GAME;
      }
    }
    else if (state == stateEnum.END_GAME){
      if (key.isPressed('enter')) {
        resetGameFromBeginning();
        state = stateEnum.IN_GAME;
      }
    }
  }
}

// Suppressing up down left right.
$(document).ready( function () {
  $(document).keydown(function(event){
    if (event.keyCode >= 37 && event.keyCode <= 40) 
        event.preventDefault();
  });
});
