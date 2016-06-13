var slimeRadius = 60;
var acceleration = 1.2;

class Slime extends createjs.Shape {
  constructor(jumpKey, downKey, leftKey, rightKey, radius, color){
    super();
    // Can deprecate color later.
    this.color = color;
    this.radius = radius;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.onFire = false;
    this.jumpKey = jumpKey;
    this.downKey = downKey;
    this.leftKey = leftKey;
    this.rightKey = rightKey;
  }
  changeColor() {
  }
  getOnFire () {
    return this.onFire;
  }
  setOnFire () {
    this.onFire = true;
  }
  toggleOnFire() {
    if (this.onFire) {
      this.onFire = false;
    }
    else {
      this.onFire = true;
    }
  }
  getJumpKey () {
    return this.jumpKey;
  }
  getDownKey () {
    return this.downKey;
  }
  getLeftKey () {
    return this.leftKey;
  }
  getRightKey () {
    return this.rightKey;
  }
}

function updateSlimeColors(slime) {
  if (key.isPressed(slime.getDownKey())) {
    slime.toggleOnFire();
    if (!slime.getOnFire()){
      // 0.05 is added to the radius so that the original slime's colors 
      // completely cover the onFire slime's most recent color.
      slime.graphics.beginFill(slime.color).arc(0, 0, slime.radius + 0.05, Math.PI, 0);
    }
  }
  if (slime.getOnFire()){
    flashColors(slime);
  }
}

var tickCountOnFire = 0;
function flashColors(slime) {
  var colors = ["Red", "DeepSkyBlue", "Green", "Yellow", "Blue", "Black"];
  var colorIndex = Math.floor(tickCountOnFire / 3) % 6;
  slime.graphics.beginFill(colors[colorIndex]).arc(0, 0, slime.radius, Math.PI, 0);
  ++tickCountOnFire;
}

function updateSlimeSpeed(floor, slime) {
  if (slime.y < floor) {
    slime.ySpeed += 1.2
  }
  else {
    slime.ySpeed = 0;
  }

  slime.xSpeed = 0;
  if (key.isPressed(slime.getJumpKey())) {
    if (slime.y >= floor){
      slime.ySpeed = -18;
    }
  }
  if (key.isPressed(slime.getLeftKey())) {
    slime.xSpeed = -12;
  }
  if (key.isPressed(slime.getRightKey())) {
    slime.xSpeed  = 12;
  }
  if (slime.getOnFire()) {
    slime.xSpeed *= 2;
  }
}

function updateSlime(floor, leftWall, rightWall, slime){
  updateSlimeSpeed(floor, slime);
  slime.x += slime.xSpeed;
  slime.y += slime.ySpeed;
  if (slime.y > floor) {
    slime.y = floor;
  }
  if (slime.x < leftWall + slime.radius){
    slime.x = leftWall + slime.radius;
  }
  if (slime.x > rightWall - slime.radius){
    slime.x = rightWall - slime.radius;
  }
  updateSlimeColors(slime);
}

function makeCircleSlime (color, jumpKey, downKey, leftKey, rightKey, xCoord = 200, radius = slimeRadius, floor = 400)  { 
  var slime = new Slime(jumpKey, downKey, leftKey, rightKey, radius, color);
  slime.graphics.beginFill(color).arc(0, 0, slime.radius, Math.PI, 0);
  slime.x = xCoord;
  slime.y = floor;
  return slime;
}
