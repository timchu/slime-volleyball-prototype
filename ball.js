var acceleration = 1.5;

class Ball extends createjs.Shape {
  constructor() {
    super();
    this.xSpeed = 0;
    this.ySpeed = 0;
  }
  gravity (accleeration) {
    this.ySpeed = this.ySpeed + acceleration;
  }
  update () {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
    this.gravity(acceleration);
  }
}

function makeBall (color, x, y) {
  var ball = new Ball();
  ball.graphics.beginFill(color).drawCircle(0, 0, 10);
  ball.x = x;
  ball.y = y;
  return ball;
}
