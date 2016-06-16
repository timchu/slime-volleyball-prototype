var stage;
var redSlime;
var blueSlime;
var ball;
var floor = 400;
var leftWallX = 0;
var rightWallX = 900;
var net;
var netX = (leftWallX + rightWallX)/2;
var netWidth = 4;
var netHeight = 35;

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
    }
    else {
      playerOneScore += 1;
      playerTwoScore -= 1;
      if (playerTwoScore == 0){
        state = stateEnum.END_GAME;
      }
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

  redSlime = stage.addChild(makeCircleSlime("Red", 'up', 'down', 'left', 'right', rightWallX - initSlimeX));
  blueSlime = stage.addChild(makeCircleSlime("DeepSkyBlue", 'w','s','a','d', initSlimeX));
  net = new createjs.Shape();
  net.graphics.beginFill("Black").drawRect(netX - netWidth/2, floor - netHeight, netWidth, netHeight);
  stage.addChild(net);

  // Do not add overscreen yet.
  overScreen = new createjs.Shape();
  overScreen.graphics.beginFill("Green").drawRect(0, 0, 1000, 1000);

  ball = stage.addChild(makeBall("Black", initSlimeX, 200));

  scoreContainer = new createjs.Container();
  displayScore(playerOneScore, playerTwoScore);

}

function clearGame() {
  stage.removeChild(ball);
  stage.removeChild(redSlime);
  stage.removeChild(blueSlime);
  stage.removeChild(scoreContainer);
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
    scoreContainer.addChild(makeBall("DeepSkyBlue", 36 + 60*i, 60, 18));
  }
  for (var i = 0; i < b; ++i) {
    scoreContainer.addChild(makeBall("Red", rightWallX - 36 - 60*i, 60, 18));
  }
  stage.addChild(scoreContainer);
}

function init() {
  stage = new createjs.Stage("demoCanvas");
  setDefaultScore();
  initGame();
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener("tick", stage);
  createjs.Ticker.addEventListener("tick", tick);

  function tick(event) {
    if (state == stateEnum.IN_GAME) {
      if (key.isPressed('p')){
        state = stateEnum.PAUSED;
        stage.removeChild(scoreContainer);
      }
      collideWalls(ball);
      collideNet(ball);
      updateSlime(floor, netX + netWidth, rightWallX, redSlime);
      updateSlime(floor, leftWallX, netX, blueSlime);
      updateBall(redSlime, blueSlime, ball);
      checkFloor(ball);
    }
    else if (state == stateEnum.AFTER_POINT){
      if (key.getPressedKeyCodes() > 0) {
        resetGameAfterPoint();
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
