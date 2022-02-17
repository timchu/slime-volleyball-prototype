var socket = io();
var slimeRadius = 60;
var acceleration = 1.2;

class Slime extends createjs.Shape {
  constructor(x, y, jumpKey, downKey, leftKey, rightKey, radius, color){
    super();
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = radius;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.onFire = false;
    this.keys = {
      jumpKey:  jumpKey,
      downKey:  downKey,
      leftKey:  leftKey,
      rightKey:  rightKey
    }
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
    return this.keys.jumpKey;
  }
  getDownKey () {
    return this.keys.downKey;
  }
  getLeftKey () {
    return this.keys.leftKey;
  }
  getRightKey () {
    return this.keys.rightKey;
  }
  render () {
    this.graphics.beginFill(this.color).arc(0, 0, this.radius, Math.PI, 0);
  }
}

function updateSlimeColors(slime) {
  if (key.isPressed(slime.getDownKey())) {
    slime.toggleOnFire();
    if (!slime.getOnFire()){
      // 0.05 is added to the radius so that the original slime's colors 
      // completely cover the onFire slime's last color.
      slime.graphics.beginFill(slime.color).arc(0, 0, slime.radius + 0.05, Math.PI, 0);
    }
  }
  if (slime.getOnFire()){
    flashColors(slime);
  }
}

var tickCountOnFire = 0;

// Note: I'm not sure if this flashing colors causes N layers of slimes to be
// rendered one on top of another. Knowing this would require understanding how
// beginFill works.
function flashColors(slime) {
  var colors = ["Red", "DeepSkyBlue", "Green", "Yellow", "Blue", "Black"];
  var colorIndex = Math.floor(tickCountOnFire / 3) % 6;
  slime.graphics.beginFill(colors[colorIndex]).arc(0, 0, slime.radius, Math.PI, 0);
  ++tickCountOnFire;
}

function broadcastSlimeMoves(floor, slime, id, playerNum) {
  movement = {
    move: '',
    id: id
  }
  if (playerNum != id){
    return;
  }
  if (key.isPressed(slime.getJumpKey())) {
    if (slime.y >= floor){
      movement.move = 'jump'
      socket.emit('slime movement', movement);
    }
  }
  if (key.isPressed(slime.getLeftKey())) {
      movement.move = 'left'
      socket.emit('slime movement', movement);
  }
  if (key.isPressed(slime.getRightKey())) {
      movement.move = 'right'
      socket.emit('slime movement', movement);
  }
  if (slime.getOnFire()) {
      movement.move = 'onfire'
      socket.emit('slime movement', movement);
  }
}
function updateSlimeSpeed(floor, slime, move) {

  slime.xSpeed = 0;
  if (move == 'jump') {
    if (slime.y >= floor){
      slime.ySpeed = -18;
    }
  }
  if (move == 'left') {
    slime.xSpeed = -12;
  }
  if (move == 'right') {
    slime.xSpeed  = 12;
  }
  if (move == 'onfire') {
    slime.xSpeed *= 2;
  }
}

function keepSlimeInBounds(floor, leftWall, rightWall, slime){
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
  slime.xSpeed = 0;
  if (slime.y < floor) {
    slime.ySpeed += 1.2
  }
  else {
    slime.ySpeed = 0;
  }
}

function makeCircleSlime (color, jumpKey, downKey, leftKey, rightKey, xCoord = 200, radius = slimeRadius, floor = 400)  { 
  var slime = new Slime(xCoord, floor, jumpKey, downKey, leftKey, rightKey, radius, color);
  slime.render()
  return slime;
}
