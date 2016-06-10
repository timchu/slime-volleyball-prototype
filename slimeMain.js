var floor = 300;
var stage;
var redCircle;
var blueCircle;

class Slime extends createjs.Shape {
  constructor(jump, down, left, right){
    super();
    this.onFire = false;
    this.jump = jump;
    this.down = down;
    this.left = left;
    this.right = right;
  }
  getOnFire () {
    return this.onFire;
  }
  setOnFire () {
    this.onFire = true;
  }
  onGround() {
    return this.y == floor;
  }
  getJump () {
    return this.jump;
  }
  getDown () {
    return this.down;
  }
  getLeft () {
    return this.left;
  }
  getRight () {
    return this.right;
  }
}

function makeCircleSlime (color, jump, down, left, right, xOffset = 0)  { 
  var slime = new Slime(jump, down, left, right);
  slime.graphics.beginFill(color).drawCircle(0, 0, 50);
  slime.x = 100 + xOffset;
  slime.y = floor;
  return slime
}

function jump(stageObject){
  createjs.Tween.get(stageObject, { loop: false })
    .to({ y: 100 }, 500, createjs.Ease.getPowOut(2))
    .to({ y: floor }, 500, createjs.Ease.getPowIn(2));
}

function wrap (stage, stageObject) {
  if (stageObject.x > stage.canvas.width) {
    stageObject.x = 0;
  }
  if (stageObject.x < 0) {
    stageObject.x = stage.canvas.width;
  }
  if (stageObject.y < 0) {
    stageObject.y = floor;
  }
}

function update(slime) {
  if (key.isPressed(slime.getJump())) {
    if (slime.onGround()){
      jump(slime)
    }
  }
  if (key.isPressed(slime.getDown())) {
  }
  if (key.isPressed(slime.getLeft())) {
      slime.x -=30 
  }
  if (key.isPressed(slime.getRight())) {
      slime.x +=30 
  }
  wrap(stage, redCircle);
  wrap(stage, blueCircle);
}

function init() {
    stage = new createjs.Stage("demoCanvas");
    redCircle = stage.addChild(makeCircleSlime("Red", 'up', 'down', 'left', 'right', 500));
    blueCircle = stage.addChild(makeCircleSlime("DeepSkyBlue", 'w','s','a','d'));
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.addEventListener("tick", tick);

    function tick(event) {
      update (redCircle);
      update (blueCircle);
    }
}

// Suppressing up down left right.
$(document).ready( function () {
  $('#demoCanvas').keydown(function(event){
    console.log(event.keyCode);
    if (event.keyCode >= 37 && event.keyCode <= 40) 
        event.preventDefault();
  });
});
