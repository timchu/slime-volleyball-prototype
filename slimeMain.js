var stage;
var redCircle;
var blueCircle;



function init() {
    stage = new createjs.Stage("demoCanvas");
    redCircle = stage.addChild(makeCircleSlime("Red", 'up', 'down', 'left', 'right', 500));
    blueCircle = stage.addChild(makeCircleSlime("DeepSkyBlue", 'w','s','a','d'));
    ball = stage.addChild(makeBall("Black", 100, 100));
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", stage);
    createjs.Ticker.addEventListener("tick", tick);

    function tick(event) {
      redCircle.update()
      blueCircle.update()
      ball.update()
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
