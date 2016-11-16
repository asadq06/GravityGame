var Game = function (canvas) {
    this.frameRate = 30;
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");

    this.startAngle = 0;
    this.endAngle = 1.8 * Math.PI;
    this.frame = 0;

    this.lastUpdate = 0;
    this.rotationSpeed = 1 / 2;

    console.log("Instance Created");

}

Game.prototype.run = function () {
    this.update();
    this.clear();
    this.draw();
}

Game.prototype.update = function () {
    console.log(this.frame);
    this.frame++;
    var startTime = new Date().getTime();

    if (this.lastUpdate == 0) {
        this.lastUpdate = startTime;
    }
    else {
        var timeInterval = startTime - this.lastUpdate;
        
        var incrementPercent = timeInterval / (this.rotationSpeed * 1000);
        var incrementValue = incrementPercent * 2 * Math.PI;
        this.endAngle += incrementValue;
        this.startAngle += incrementValue;

        console.log(incrementPercent);

        this.lastUpdate = startTime;
    }
}

Game.prototype.clear = function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Game.prototype.draw = function () {
    this.context.beginPath();
    this.context.arc(95, 50, 40, this.startAngle, this.endAngle);
    this.context.stroke();

}

var myCanvas = document.getElementById("myCanvas");
var myGame = new Game(myCanvas);
window.setInterval(myGame.run.bind(myGame), 1000 / myGame.frameRate);