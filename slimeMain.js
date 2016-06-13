var stage;
var redSlime;
var blueSlime;
var ball;
var floor = 400;
var leftWallX = 0;
var rightWallX = 1000;
var netX = (leftWallX + rightWallX)/2;
var netWidth = 4;
var netHeight = 35;

// This is used in ball.js. This should all be cleaned up.
var acceleration = 0.5;

function collideWalls(ball) {
  if (ball.y >=  floor - ball.radius) {
    ball.y = floor - ball.radius
    ball.ySpeed = - ball.ySpeed;
  }
  if (ball.x <= leftWallX + ball.radius || ball.x >= rightWallX - ball.radius) { 
    ball.xSpeed = - ball.xSpeed;
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
var initSlimeX = 180;
function init() {
    stage = new createjs.Stage("demoCanvas");
    redSlime = stage.addChild(makeCircleSlime("Red", 'up', 'down', 'left', 'right', rightWallX - initSlimeX));
    blueSlime = stage.addChild(makeCircleSlime("DeepSkyBlue", 'w','s','a','d', initSlimeX));
    var net = new createjs.Shape();
    net.graphics.beginFill("Black").drawRect(netX - netWidth/2, floor - netHeight, netWidth, netHeight);
    stage.addChild(net);

    ball = stage.addChild(makeBall("Black", initSlimeX, 100));
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.addEventListener("tick", tick);

    function tick(event) {
      collideWalls(ball);
      collideNet(ball);
      updateSlime(floor, netX + netWidth, rightWallX, redSlime);
      updateSlime(floor, leftWallX, netX, blueSlime);
      updateBall(redSlime, blueSlime, ball);
    }
}

// Suppressing up down left right.
$(document).ready( function () {
  $(document).keydown(function(event){
    if (event.keyCode >= 37 && event.keyCode <= 40) 
        event.preventDefault();
  });
});
