var floor = 350;
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
      slime.graphics.beginFill(slime.color).arc(0, 0, slime.radius, Math.PI, 0);
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

function updateSlimeSpeed(slime) {
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

function updateSlime(leftWall, rightWall, slime){
  updateSlimeSpeed(slime);
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

function makeCircleSlime (color, jumpKey, downKey, leftKey, rightKey, xOffset = 0, radius = slimeRadius)  { 
  var slime = new Slime(jumpKey, downKey, leftKey, rightKey, radius, color);
  slime.graphics.beginFill(color).arc(0, 0, slime.radius, Math.PI, 0);
  slime.x = 100 + xOffset;
  slime.y = floor;
  return slime;
}

function wrap (stage, stageObject) {
  if (stageObject.x > stage.canvas.width) {
    stageObject.x = 0;
  }
  if (stageObject.x < 0) {
    stageObject.x = stage.canvas.width;
  }
  if (stageObject.y < 0) {
    stageObject.y = floor - slimeRadius;
  }
}

