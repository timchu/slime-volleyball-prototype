// acceleration is a global variable dependent on the stage.
var ballGravity = 0.5;
//  Radius should be a property of ball.
var ballRadius = 14;
var MAX_X_SPEED=15;
var MAX_Y_SPEED=11;

class Ball extends createjs.Shape {
  constructor(radius) {
    super();
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.clientX;
    this.clientY;
    this.radius = radius;
  }
  setSpeed(xSpeed, ySpeed) {
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  }
}

function applyGravity (shape, acceleration) {
  shape.ySpeed = shape.ySpeed + acceleration;
}

function makeBall (color, x, y, radius = ballRadius) {
  var ball = new Ball(radius);
  ball.graphics.beginFill(color).drawCircle(0, 0, radius);
  ball.x = x;
  ball.y = y;
  ball.clientX = x;
  ball.clientY = y;
  return ball;
}

function collide(slime, ball) {
  var dx = ball.clientX - slime.clientX;
  var dy = slime.clientY - ball.clientY; /// lower object has higher y coordinate
  var dXSpeed = ball.xSpeed - slime.xSpeed;
  var dYSpeed = slime.ySpeed - ball.ySpeed;
  var dist = Math.sqrt (dx * dx + dy * dy);
  if (dy > 0 && dist < slime.radius + ball.radius) {
    ball.clientX = slime.clientX + (slime.radius+ball.radius) * dx / dist;
    ball.clientY = slime.clientY - (slime.radius+ball.radius) * dy / dist;

    // I have no idea how to interpret this part. This is cribbed from
    // Marler8997.
    var something = (dx * dXSpeed + dy * dYSpeed) / dist;
    if(something <= 0) {
      ball.xSpeed += slime.xSpeed - 1.92 * dx * something / dist;
      ball.ySpeed += slime.ySpeed + 1.92 * dy * something / dist;
    }
  }
}

function updateBall (slime1, slime2, ball) {
  ball.clientX += ball.xSpeed;
  ball.clientY += ball.ySpeed;
  applyGravity(ball, ballGravity);

  collide(slime1, ball);
  collide(slime2, ball);

  if (ball.xSpeed > MAX_X_SPEED) {
    ball.xSpeed  = MAX_X_SPEED
  }
  if (ball.xSpeed < - MAX_X_SPEED) {
    ball.xSpeed  = - MAX_X_SPEED
  }
  if (ball.ySpeed > MAX_Y_SPEED) {
    ball.ySpeed  = MAX_Y_SPEED
  }
  if (ball.ySpeed < -MAX_Y_SPEED) {
    ball.ySpeed  = -MAX_Y_SPEED
  }
}

function broadcastBallCoords(ball) { 
  ballCoords = {
    x: ball.clientX,
    y: ball.clientY,
  };
  socket.emit('ball coordinates', ballCoords);
}

function receiveBallCoords(playerNum) {
  socket.on('ball coordinates', (ballCoords) => {
    if (playerNum == 2) {
      console.log("Player number TWO!")
    }
    ball.x = ballCoords.x;
    ball.y = ballCoords.y;
  });
}
