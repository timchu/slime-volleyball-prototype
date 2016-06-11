var floor = 300;

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
  update() {
    if (key.isPressed(this.getJump())) {
      if (this.onGround()){
        jump(this)
      }
    }
    if (key.isPressed(this.getDown())) {
    }
    if (key.isPressed(this.getLeft())) {
        this.x -=30 
    }
    if (key.isPressed(this.getRight())) {
        this.x +=30 
    }
    wrap(stage, this);
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

