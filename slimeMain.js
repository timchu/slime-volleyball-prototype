var stage;
var redSlime;
var blueSlime;
var ball;
var floor = 350;
var leftWallX = 0;
var rightWallX = 800;
var netX = (leftWallX + rightWallX)/2;
var netWidth = 4;

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

function init() {
    stage = new createjs.Stage("demoCanvas");
    redSlime = stage.addChild(makeCircleSlime("Red", 'up', 'down', 'left', 'right', 600));
    blueSlime = stage.addChild(makeCircleSlime("DeepSkyBlue", 'w','s','a','d'));
    var net = new createjs.Shape();
    net.graphics.beginFill("Black").drawRect(netX, floor - 35, 4, 35);
    stage.addChild(net);
    ball = stage.addChild(makeBall("Black", 100, 100));
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.addEventListener("tick", tick);

    function tick(event) {
      collideWalls(ball);
      updateSlime(netX + netWidth, rightWallX, redSlime);
      updateSlime(leftWallX, netX, blueSlime);
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
